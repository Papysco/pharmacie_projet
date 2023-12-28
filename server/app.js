const express = require("express");
const cors = require("cors");
const connexion = require("./connexion");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
// const format = require('date-fns/format');
const { format } = require('date-fns');

// initialisation
const app = express();
app.use(cors());

// routes
app.get("/stock", function (req, res) {
  const requete = `SELECT m.id_medicament, m.nom, m.type, m.prix, s.quantite , DATE_FORMAT(m.date_fabrication, '%Y/%m/%d') as date_fabrication, 
  DATE_FORMAT(m.date_expiration, '%Y/%m/%d') as date_expiration
  FROM stock s, medicament m
  WHERE s.id_medicament = m.id_medicament`;

  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }

    res.json(results);
  });
});

app.get("/venteRecentes", function (req, res) {
  const dateSelectionne = req.query.date;
  // console.log(dateSelectionne);

  const requete = `SELECT m.id_medicament as id ,m.nom, m.type ,m.prix, DATE_FORMAT(m.date_fabrication, '%Y/%m/%d') as date_fabrication ,
    DATE_FORMAT(m.date_expiration, '%Y/%m/%d') as date_expiration
    FROM vente v , medicament m 
    WHERE v.id_medicament = m.id_medicament
    AND v.date_vente= "${dateSelectionne}"
  `;

  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête , vente" });
    }
    res.json(results);
  });
});

app.get("/venteToDay", function (req, res) {

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  const requete = `SELECT m.id_medicament as id ,m.nom, m.type ,m.prix, DATE_FORMAT(m.date_fabrication, '%Y/%m/%d') as date_fabrication ,
    DATE_FORMAT(m.date_expiration, '%Y/%m/%d') as date_expiration
    FROM vente v , medicament m 
    WHERE v.id_medicament = m.id_medicament
    AND v.date_vente = "${formattedDate}"
  `;
  
  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête , vente" });
    }
    res.json(results);
  });
});

app.get("/ventes", function (req, res) {  

  let requete = `SELECT m.id_medicament as id ,m.nom, m.type ,m.prix, DATE_FORMAT(m.date_fabrication, '%Y/%m/%d') as date_fabrication ,
    DATE_FORMAT(m.date_expiration, '%Y/%m/%d') as date_expiration
    FROM vente v , medicament m 
    WHERE v.id_medicament = m.id_medicament
  `;
  
  requete = `SELECT * FROM vente;
`;

  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }
    res.json(results);
  });
});

app.get("/medicament", (req, res) => {
  const requete = "SELECT id_medicament, nom FROM medicament ";
  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }

    res.json(results);
  });
});

app.get("/fournisseur", (req, res) => {
  const requete = "SELECT email FROM fournisseur";
  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }

    res.json(results);
  });
});

app.get("/nombreMedicament", (req, res) => {
  const requete = "SELECT COUNT(*) as count FROM stock";
  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }

    res.json(results);
  });
});

app.get("/nombreVente", (req, res) => {
  const requete =
    "SELECT COUNT(*) as count FROM vente WHERE DATE_FORMAT(date_vente, '%y/%m/%d') = DATE(NOW())";
  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }

    res.json(results);
  });
});

app.get("/personnel", (req, res) => {
  const requete = "SELECT * FROM `pharmacien` WHERE 1";
  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }
    res.json(results);
  });
});

app.get("/nombreMedicamentAlerte", (req, res) => {
  const requete = `
    SELECT COUNT(*) as count
    FROM stock s, medicament m
    WHERE s.id_medicament = m.id_medicament AND
    DATEDIFF(DATE_FORMAT(m.date_expiration, '%y/%m/%d'), DATE_FORMAT(DATE(NOW()), '%y/%m/%d')) <= 90;
  `;

  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }

    res.json(results);
  });
});

app.get("/nombreMedicamentPerime", (req, res) => {
  const requete = `
    SELECT COUNT(*) as count
    FROM stock s, medicament m
    WHERE s.id_medicament = m.id_medicament AND
    DATEDIFF(DATE_FORMAT(m.date_expiration, '%y/%m/%d'), DATE_FORMAT(DATE(NOW()), '%y/%m/%d')) <= 0;
  `;

  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }

    res.json(results);
  });
});

// AJOUT -----------------------------------------------------------------------

app.use(bodyParser.json());

// Gérer la requête POST depuis le formulaire
app.post("/ajouter-medicament", (req, res) => {
  const {
    nom_medicament,
    prix_unitaire,
    type,
    quantite,
    date_fabrication,
    date_expiration,
    // posologie,
  } = req.body;

  const verifierMedicamentQuery = `SELECT COUNT(*) as nbrMedicament FROM medicament WHERE UPPER(nom) = UPPER(?)`;

  connexion.query(
    verifierMedicamentQuery,
    [nom_medicament],
    (erreurVerif, resultatsVerif) => {
      if (erreurVerif) {
        console.error(
          "Erreur lors de la vérification de l'existence du médicament:",
          erreurVerif
        );
        res.status(500).json({
          erreur: "Erreur lors de la vérification de l'existence du médicament",
        });
        return;
      }

      const nbrMedicament = resultatsVerif[0].nbrMedicament;

      if (nbrMedicament === 0) {
        const insererMedicamentQuery = `INSERT INTO medicament (nom, type, prix, date_fabrication, date_expiration) VALUES (?, ?, ?, ?, ?)`;

        connexion.query(
          insererMedicamentQuery,
          [
            nom_medicament,
            type,
            prix_unitaire,
            date_fabrication,
            date_expiration,
            // posologie,
          ],
          (erreurInsert, resultatsInsert) => {
            if (erreurInsert) {
              console.error(
                "Erreur lors de l'enregistrement du médicament:",
                erreurInsert
              );
              res.status(500).json({
                erreur: "Erreur lors de l'enregistrement du médicament",
              });
              return;
            }

            const id_medicament = resultatsInsert.insertId;

            const insererStockQuery = `INSERT INTO stock (id_medicament, quantite) VALUES (?, ?)`;

            connexion.query(
              insererStockQuery,
              [id_medicament, quantite],
              (erreurStock) => {
                if (erreurStock) {
                  console.error(
                    "Erreur lors de l'enregistrement dans la table de stock:",
                    erreurStock
                  );
                  res.status(500).json({
                    erreur:
                      "Erreur lors de l'enregistrement dans la table de stock",
                  });
                } else {
                  console.log("Médicament enregistré avec succès");
                  res
                    .status(200)
                    .json({ message: "Médicament enregistré avec succès" });
                }
              }
            );
          }
        );
      } else {
        const miseAJourMedicamentQuery = `UPDATE medicament SET prix = ?, date_fabrication = ?, date_expiration = ? WHERE UPPER(nom) = UPPER(?)`;

        connexion.query(
          miseAJourMedicamentQuery,
          [prix_unitaire, date_fabrication, date_expiration, nom_medicament],
          (erreurMiseAJour) => {
            if (erreurMiseAJour) {
              console.error(
                "Erreur lors de la mise à jour du médicament:",
                erreurMiseAJour
              );
              res.status(500).json({
                erreur: "Erreur lors de la mise à jour du médicament",
              });
              return;
            }

            const obtenirIdQuery = `SELECT id_medicament as id FROM medicament WHERE UPPER(nom) = UPPER(?)`;

            connexion.query(
              obtenirIdQuery,
              [nom_medicament],
              (erreurObtenirId, resultatsObtenirId) => {
                if (erreurObtenirId) {
                  console.error(
                    "Erreur lors de la récupération de l'ID du médicament:",
                    erreurObtenirId
                  );
                  res.status(500).json({
                    erreur:
                      "Erreur lors de la récupération de l'ID du médicament",
                  });
                  return;
                }

                const id_medicament = resultatsObtenirId[0].id;

                const miseAJourStockQuery = `UPDATE stock SET quantite = ? WHERE id_medicament = ?`;

                connexion.query(
                  miseAJourStockQuery,
                  [quantite, id_medicament],
                  (erreurStock) => {
                    if (erreurStock) {
                      console.error(
                        "Erreur lors de la mise à jour du stock:",
                        erreurStock
                      );
                      res.status(500).json({
                        erreur: "Erreur lors de la mise à jour du stock",
                      });
                    } else {
                      console.log("Médicament mis à jour avec succès");
                      res
                        .status(200)
                        .json({ message: "Médicament mis à jour avec succès" });
                    }
                  }
                );
              }
            );
          }
        );
      }
    }
  );
});

// COMMANDER ---------------------------------------------------------------

app.post("/commander", async (req, res, next) => {
  try {
    const {
      nom_medicament,
      type,
      quantite,
      fournisseurSelectionne,
      emailPharmacien,
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "papyscofall@gmail.com",
        pass: "idof asrw pnjl cepi",
      },
      // host: "localhost",
      // port: 1025, avec mailDev
      // secure: false,
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    const message = {
      from: "papyscofall@gmail.com",
      to: fournisseurSelectionne,
      subject: "Commande d'un medicament",
      html: `
      <b>Nom Medicament:</b> ${nom_medicament}<br/>
      <b>Type:</b> ${type}<br/>
      <b>Quantite:</b> ${quantite}<br/><br/>
      <b>Email Pharmacien :</b> ${emailPharmacien} <br/>
      <b>Date : </b> ${Date()}
    `,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error(error);
        res.status(400).json("error");
      } else {
        console.log("Email envoyé avec succès:", info.response);
        res.json("sended");
      }
      next();
    });

    // ------------------------------------------

    const idPharmacienResult = await executerRequete(
      `SELECT id_pharmacien FROM pharmacien WHERE email = "${emailPharmacien}"`
    );
    const id_pharmacien = idPharmacienResult[0].id_pharmacien;

    const idMedicamentResult = await executerRequete(
      `SELECT id_medicament FROM medicament WHERE UPPER(nom) = UPPER("${nom_medicament}")`
    );
    const id_medicament = idMedicamentResult[0].id_medicament;

    const idFournisseurResult = await executerRequete(
      `SELECT id_fournisseur FROM fournisseur WHERE email = "${fournisseurSelectionne}"`
    );
    const id_fournisseur = idFournisseurResult[0].id_fournisseur;

    const factureInsertResult = await executerRequete(
      `INSERT INTO facture_commande (date_facture) VALUES (DATE_FORMAT(DATE(NOW()), '%y/%m/%d'))`
    );
    const id_facture = factureInsertResult.insertId;

    const dateActuelle = new Date();

    await executerRequete(
      `INSERT INTO commande (date_commande, quantite, id_pharmacien, id_fournisseur, id_medicament, id_facture)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dateActuelle,
        quantite,
        id_pharmacien,
        id_fournisseur,
        id_medicament,
        id_facture,
      ]
    );

    res.status(200).json({
      message: "Commande enregistrée avec succès",
    });
  } catch (error) {
    // console.error("Erreur lors de l'enregistrement de la commande:", error);
    res.status(500).json({
      erreur: "Erreur lors de l'enregistrement de la commande",
    });
  }
});

function executerRequete(query, parametre = []) {
  return new Promise((resolve, reject) => {
    connexion.query(query, parametre, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// VENDRE ---------------------------------------------------------------

app.post("/vendre", async (req, res) => {
  try {
    const { id_medicament, quantite, hopital, docteur, emailPharmacien } =
      req.body;

    const dateActuelle = new Date();

    const idFactureResult = await executerRequete(
      `INSERT INTO facture_vente (dateFacture, hopital, docteur)
      VALUES (?, ?, ?)`,
      [dateActuelle, hopital, docteur]
    );

    const id_facture = idFactureResult.insertId;

    const idPharmacienResult = await executerRequete(
      `SELECT id_pharmacien FROM pharmacien WHERE email = "${emailPharmacien}"`
    );
    const id_pharmacien = idPharmacienResult[0].id_pharmacien;

    const idVenteResult = await executerRequete(
      `INSERT INTO vente (id_facture_vente, date_vente, quantite, id_pharmacien, id_medicament)
      VALUES (?, ?, ?, ?, ?)`,
      [id_facture, dateActuelle, quantite, id_pharmacien, id_medicament]
    );

    // MAJ Stock
    await executerRequete(`UPDATE stock SET quantite = quantite - ${quantite} 
                          WHERE id_medicament  = ${id_medicament}`);

    const idQuantiteResult = await executerRequete(
      `SELECT quantite FROM stock WHERE id_medicament = ${id_medicament}`
    );

    const quantiteRestant = idQuantiteResult[0].quantite;
    if (quantiteRestant <= 0) {
      await executerRequete(
        `DELETE FROM stock WHERE id_medicament  = ${id_medicament}`
      );
    }

    console.log("Vente enregistrée avec succès");
    res.status(200).json({
      message: "Vente enregistrée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la vente:", error);
    res.status(500).json({
      erreur: "Erreur lors de l'enregistrement de la vente",
    });
  }
});

function executerRequete(query, parametre = []) {
  return new Promise((resolve, reject) => {
    connexion.query(query, parametre, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// GERER PERSONNEL

app.post("/personnel_supprimer", async (req, res) => {
  const { id } = req.body;

  const requete = `DELETE FROM pharmacien where id_pharmacien = ${id}`;

  connexion.query(requete, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'exécution de la requête" });
    }
    // res.json(results);
  });
});

app.post("/ajouter-personnel", async (req, res) => {
  const { prenom, nom, admin, type_personne, email, mdp, telephone } = req.body;

  if (type_personne == 0) {
    const requete_pharmacien = `INSERT INTO pharmacien (prenom, nom, admin, telephone, email, mdp) 
    VALUES (?, ?, ?, ?, ?, ?)`;

    connexion.query(
      requete_pharmacien,
      [prenom, nom, admin, telephone, email, mdp],
      (erreur, resultat) => {
        if (erreur) {
          console.error("Erreur d'insertion du personnel", erreur);
          res.status(500).json({
            erreur: "Erreur  d'insertion du pharmacien ou fournisseur",
          });
          return;
        }
      }
    );
  } else {
    const requete_fournisseur = `INSERT INTO fournisseur (prenom, nom, email, num_tel) 
    VALUES (?, ?, ?, ?)`;

    connexion.query(
      requete_fournisseur,
      [prenom, nom, email, telephone],
      (erreur, resultat) => {
        if (erreur) {
          console.error("Erreur d'insertion du personnel", erreur);
          res.status(500).json({
            erreur: "Erreur  d'insertion du pharmacien ou fournisseur",
          });
          return;
        }
      }
    );
  }
});

app.post("/modifier-personnel", async (req, res) => {
  const { id, prenom, nom, admin, email, mdp, telephone } = req.body;

  const requete_pharmacien = `UPDATE  pharmacien 
    SET prenom = "${prenom}", nom = "${nom}", admin = ${admin}, telephone = "${telephone}", email = "${email}", mdp = "${mdp}" 
    WHERE id_pharmacien = ${id}`;

  connexion.query(requete_pharmacien, (erreur, resultat) => {
    if (erreur) {
      console.error("Erreur de modification du personnel", erreur);
      return res.status(500).json({
        erreur: "Erreur  de modification du pharmacien",
      });
    }
  });
});

// lancement server
app.listen(30500, (error) => {
  if (error) throw error;
  console.log("App runing at port 30500");
});

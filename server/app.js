const express = require("express");
const cors = require("cors");
const connexion = require("./connexion");
const bodyParser = require("body-parser");

// initialisation
const app = express();
app.use(cors());

// routes
app.get("/stock", function (req, res) {
  const requete = `SELECT m.nom, m.type, m.prix, s.quantite , DATE_FORMAT(m.date_fabrication, '%Y/%m/%d') as date_fabrication, 
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

  const requete = `SELECT m.id_medicament as id ,m.nom, m.type ,m.prix, DATE_FORMAT(m.date_fabrication, '%Y/%m/%d') as date_fabrication ,
    DATE_FORMAT(m.date_expiration, '%Y/%m/%d') as date_expiration
    FROM vente v , medicament m 
    WHERE v.id_medicament = m.id_medicament
    AND v.date_vente = '${dateSelectionne}'
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

app.get("/nombreMedicamentAlerte", (req, res) => {
  const requete = `
    SELECT COUNT(*) as count
    FROM stock s, medicament m
    WHERE s.id_medicament = m.id_medicament AND
    DATEDIFF(DATE_FORMAT(m.date_expiration, '%y/%m/%d'), DATE_FORMAT(DATE(NOW()), '%y/%m/%d')) <= 15;
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
    posologie,
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
        const insererMedicamentQuery = `INSERT INTO medicament (nom, type, prix, date_fabrication, date_expiration, posologie) VALUES (?, ?, ?, ?, ?, ?)`;

        connexion.query(
          insererMedicamentQuery,
          [
            nom_medicament,
            type,
            prix_unitaire,
            date_fabrication,
            date_expiration,
            posologie,
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

app.post("/commander", async (req, res) => {
  try {
    const {
      nom_medicament,
      type,
      quantite,
      fournisseurSelectionne,
      emailPharmacien,
    } = req.body;

    // Bloc Envoi e-mail au fournisseur
    // A completer .....

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

    console.log("Commande enregistrée avec succès");
    res.status(200).json({
      message: "Commande enregistrée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la commande:", error);
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

// lancement server
app.listen(30500, (error) => {
  if (error) throw error;
  console.log("App runing at port 30500");
});

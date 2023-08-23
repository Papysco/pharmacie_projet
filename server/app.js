const express = require("express");
const cors = require("cors");
const connexion = require("./connexion");

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
    WHERE s.id_stock = m.id_stock AND
    DATEDIFF(DATE_FORMAT(m.date_expiration, '%y/%m/%d'), DATE_FORMAT(m.date_fabrication, '%y/%m/%d')) <= 15;
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
    WHERE s.id_stock = m.id_stock AND
    DATEDIFF(DATE_FORMAT(m.date_expiration, '%y/%m/%d'), DATE_FORMAT(m.date_fabrication, '%y/%m/%d')) <= 0;
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

// lancement server
app.listen(30500, (error) => {
  if (error) throw error;
  console.log("App runing at port 30500");
});

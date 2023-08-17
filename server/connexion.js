const mysql = require("mysql");

var connexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "pharmacie",
});

connexion.connect();

module.exports = connexion;

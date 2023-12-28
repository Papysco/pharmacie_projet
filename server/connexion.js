const mysql = require("mysql");

var connexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "!P@ssword1#",
  database: "pharmacie",
});

connexion.connect();

module.exports = connexion;

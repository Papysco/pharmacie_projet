import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "../style/accueil.css";
import pilule from "../images/pilule.png";
import pharma_icone from "../images/pharmacie_icone.png";

class Stock extends Component {
  state = {
    medicaments: [],
    recherche: "",
  };

  async componentDidMount() {
    const response = await axios.get("http://localhost:30500/stock");
    const listeMedicament = response.data;
    this.setState({ medicaments: listeMedicament });
  }

  handleSearch = (event) => {
    this.setState({ recherche: event.target.value });
  };

  calculateDateDifference = (dateDebut, dateFin) => {
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);
    const differenceTemps = dateFinObj.getTime() - dateDebutObj.getTime();
    const difference = Math.floor(differenceTemps / (1000 * 3600 * 24));
    return difference;
  };

  render() {
    const { medicaments, recherche } = this.state;
    const { user } = this.props;

    const medicamentTrie = medicaments.filter((medicament) => {
      if (recherche === "") {
        return true;
      } else {
        return medicament.nom.toLowerCase().includes(recherche.toLowerCase());
      }
    });

    if (user == null) {
      return <Navigate to="/" />;
    }

    return (
      <body className="body-accueil">
        <div
          className="table-vente-recent"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
            Stock
          </h1>
          <br />
          <br />

          <form className="form-inline" style={{ width: "70%" }}>
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Rechercher Medicament "
              aria-label="Search"
              value={recherche}
              onChange={this.handleSearch}
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0 navbar-btn"
              type="submit"
            >
              Rechercher
            </button>
          </form>

          <br />
          <table className="table table-striped">
            <thead>
              <tr style={{ fontFamily: "ubuntu-regular", fontSize: "1.5rem" }}>
                <th scope="col">
                  <img src={pharma_icone} alt="." style={{ width: "32px" }} />
                </th>
                <th scope="col">Nom Medicament</th>
                <th scope="col">Type</th>
                <th scope="col">Statut</th>
                <th scope="col">Prix Unitaire</th>
                <th scope="col">Quantité</th>
                <th scope="col">Fabrication</th>
                <th scope="col">Expiration</th>
              </tr>
            </thead>
            <tbody>
              {medicamentTrie.map((medicament) => {
                const difference = this.calculateDateDifference(
                  Date.now(),
                  medicament.date_expiration
                );
                const statut = difference <= 15 ? 1 : 0;

                return (
                  <tr key={medicament.id}>
                    <th scope="row">
                      <img src={pilule} alt="" />
                    </th>
                    <td>{medicament.nom}</td>
                    <td>{medicament.type}</td>
                    <td>
                      <span
                        className={`badge badge-primary ${
                          statut === 1 ? `bg-danger` : `bg-success`
                        }`}
                        style={{
                          color: "white",
                          fontSize: 15,
                          marginLeft: "0.5rem",
                        }}
                      >
                        {statut === 1 ? (
                          <span>En alerte</span>
                        ) : (
                          <span>Normal</span>
                        )}
                      </span>
                    </td>
                    <td>{medicament.prix} FCFA</td>
                    <td>{medicament.quantite}</td>
                    <td>{medicament.date_fabrication}</td>
                    <td>{medicament.date_expiration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </body>
    );
  }
}

export default Stock;

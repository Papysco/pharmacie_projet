import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import "../style/accueil.css";
import "../style/ajout.css";
import pilule from "../images/pilule.png";
import pharma_icone from "../images/pharmacie_icone.png";

class Vendre extends Component {
  state = {
    medicaments: [],

    recherche: "",
    id_medicament: 0,
    quantite: 1,
    prenom_client: "",
    nom_client: "",
    numero_client: "",
    prix_unitaire: 0,

    showModal: false,
    message: null,
  };

  async componentDidMount() {
    const response = await axios.get("http://localhost:30500/stock");
    const listeMedicament = response.data;

    this.setState({
      medicaments: listeMedicament,
    });
  }

  calculateDateDifference = (dateDebut, dateFin) => {
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);
    const differenceTemps = dateFinObj.getTime() - dateDebutObj.getTime();
    const difference = Math.floor(differenceTemps / (1000 * 3600 * 24));
    return difference;
  };

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSearch = (event) => {
    this.setState({ recherche: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { user } = this.props;

    const dataToSend = {
      id_medicament: this.state.id_medicament,
      quantite: this.state.quantite,
      prenom_client: this.state.prenom_client,
      nom_client: this.state.nom_client,
      numero_client: this.state.numero_client,
      emailPharmacien: user.email,
    };

    console.log(dataToSend);

    try {
      const response = await axios.post("/vendre", dataToSend);

      this.setState({
        id_medicament: null,
        quantite: 1,
        prenom_client: "",
        numero_client: "",
      });

      if (response) {
        this.setState({ message: response.data.message });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    }

    this.setState({ showModal: true });
  };

  componentDidUpdate() {}

  render() {
    const {
      id_medicament,
      quantite,
      prenom_client,
      numero_client,
      medicaments,
      recherche,
    } = this.state;

    const medicamentTrie = medicaments.filter((medicament) => {
      if (recherche === "") {
        return true;
      } else {
        return medicament.nom.toLowerCase().includes(recherche.toLowerCase());
      }
    });

    const { user } = this.props;
    if (user == null) {
      return <Navigate to="/" />;
    }

    return (
      <body className="body-accueil">
        <div className="form-container">
          <h1 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
            Formulaire de Vente
          </h1>

          <div className="global" style={{ display: "flex" }}>
            <div
              style={{
                width: "81%",
                padding: "1rem",
                margin: "2rem",
                height: "30rem",
                overflow: "auto",
              }}
            >
              <br />
              <form className="form-inline" style={{ width: "100%" }}>
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
              <table className="table table-striped table-hover">
                <thead>
                  <tr
                    style={{ fontFamily: "ubuntu-regular", fontSize: "1.5rem" }}
                  >
                    <th scope="col">
                      <img
                        src={pharma_icone}
                        alt="."
                        style={{ width: "32px" }}
                      />
                    </th>
                    <th scope="col">ID</th>
                    <th scope="col">Nom </th>
                    <th scope="col">Statut</th>
                    <th scope="col">Prix Unitaire</th>
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
                        <td>{medicament.id_medicament}</td>
                        <td>{medicament.nom}</td>

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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <br />
            <div style={{ width: "80%", margin: "2rem", marginTop: "3rem" }}>
              <h2 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
                Informations
              </h2>
              <br />
              <form onSubmit={this.handleSubmit}>
                <div className="row mb-4">
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="id_medicament">
                        ID Medicament
                      </label>
                      <input
                        type="number"
                        id="id_medicament"
                        className="form-control"
                        placeholder="Exemple : 12"
                        value={id_medicament}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="quantite">
                        Quantité
                      </label>
                      <input
                        type="number"
                        id="quantite"
                        className="form-control"
                        value={quantite}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="prix_unitaire">
                        Prix Unitaire
                      </label>
                      <input
                        type="number"
                        id="prix_unitaire"
                        className="form-control"
                        value={this.state.prix_unitaire}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="row mb-4">
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="prenom_client">
                        Prenom Client
                      </label>
                      <input
                        type="texte"
                        id="prenom_client"
                        className="form-control"
                        placeholder="Exemple : Modou"
                        value={prenom_client}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  {/* <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="nom_client">
                        Nom Client
                      </label>
                      <input
                        type="texte"
                        id="nom_client"
                        className="form-control"
                        placeholder="Exemple : Diop"
                        value={nom_client}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div> */}
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="numero_client">
                        Numero Client
                      </label>
                      <input
                        type="texte"
                        id="numero_client"
                        className="form-control"
                        placeholder="Exemple : 77 222 43 55"
                        value={numero_client}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="col">
                  <div className="row mb-4">
                    <div className="col">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="emailPharmacien">
                          E-mail Pharmacien
                        </label>
                        <input
                          type="text"
                          id="emailPharmacien"
                          className="form-control"
                          placeholder="Prenom Nom"
                          value={user.email}
                          readOnly={true}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="prix_total">
                          Prix Total
                        </label>
                        <input
                          type="number"
                          id="prix_total"
                          className="form-control"
                          // placeholder="0 FCFA"
                          value={this.state.quantite * this.state.prix_unitaire}
                          onChange={this.handleInputChange}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </div>
                  <br />

                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                    style={{
                      width: "15rem",
                      backgroundColor: "#4fabe4",
                      fontSize: "1.2rem",
                    }}
                  >
                    Valider
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel=""
          className="modal-dialog modal-dialog-centered"
          style={{
            content: {
              width: "30%",
              height: "15rem",
              margin: "auto",
              marginTop: "15rem",
              backgroundColor: "#DCDCDC",
              padding: "2rem",
              borderRadius: "30px",
            },
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{this.state.message}</h3>
              <button
                type="button"
                className="close"
                onClick={() => this.setState({ showModal: false })}
                style={{ width: "2rem" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>{this.state.message}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.setState({ showModal: false })}
              >
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      </body>
    );
  }
}

export default Vendre;

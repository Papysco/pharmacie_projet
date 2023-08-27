import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import "../style/accueil.css";
import "../style/ajout.css";

class Ajout extends Component {
  state = {
    nom_medicament: "",
    prix_unitaire: "",
    type: "",
    quantite: "",
    date_fabrication: "",
    date_expiration: "",
    posologie: "",
    showModal: false,
    message: null,
  };

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const formattedDateFabrication = new Date(
      this.state.date_fabrication
    ).toLocaleDateString("en-CA");
    const formattedDateExpiration = new Date(
      this.state.date_expiration
    ).toLocaleDateString("en-CA");

    const dataToSend = {
      nom_medicament: this.state.nom_medicament,
      prix_unitaire: this.state.prix_unitaire,
      type: this.state.type,
      quantite: this.state.quantite,
      date_fabrication: formattedDateFabrication,
      date_expiration: formattedDateExpiration,
      posologie: this.state.posologie,
    };

    try {
      const response = await axios.post("/ajouter-medicament", dataToSend);
      // console.log(response.data.message);

      this.setState({
        nom_medicament: "",
        prix_unitaire: "",
        type: "",
        quantite: "",
        date_fabrication: "",
        date_expiration: "",
        posologie: "",
      });

      if (response) {
        this.setState({ message: response.data.message });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    }

    this.setState({ showModal: true });
  };

  render() {
    const {
      nom_medicament,
      prix_unitaire,
      type,
      quantite,
      date_fabrication,
      date_expiration,
      posologie,
    } = this.state;

    const { user } = this.props;
    if (user == null) {
      return <Navigate to="/" />;
    }

    return (
      <body className="body-accueil">
        <div className="form-container">
          <h2 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
            Ajouter Médicament
          </h2>
          <br />
          <br />
          <form onSubmit={this.handleSubmit}>
            <div className="row mb-4">
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="nom_medicament">
                    Nom Médicament
                  </label>
                  <input
                    type="text"
                    id="nom_medicament"
                    className="form-control"
                    placeholder="Exemple : Paracetamol"
                    value={nom_medicament}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="prix_unitaire">
                    Prix Unitaire
                  </label>
                  <input
                    type="text"
                    id="prix_unitaire"
                    className="form-control"
                    placeholder="FCFA"
                    value={prix_unitaire}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="type">
                    Type
                  </label>
                  <input
                    type="text"
                    id="type"
                    className="form-control"
                    placeholder="Exemple : Antalgique"
                    value={type}
                    onChange={this.handleInputChange}
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
                  />
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="date_fabrication">
                    Date Fabrication
                  </label>
                  <input
                    type="date"
                    id="date_fabrication"
                    className="form-control"
                    value={date_fabrication}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="date_expiration">
                    Date Expiration
                  </label>
                  <input
                    type="date"
                    id="date_expiration"
                    className="form-control"
                    value={date_expiration}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="posologie">
                Posologie
              </label>
              <textarea
                className="form-control"
                id="posologie"
                rows="4"
                placeholder="Exemple : 1 comprimé toutes les 6 heures"
                value={posologie}
                onChange={this.handleInputChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mb-4"
              style={{
                width: "15rem",
                backgroundColor: "#4fabe4",
                fontSize: "1.2rem",
              }}
            >
              Enregistrer
            </button>
          </form>
        </div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Médicament inséré avec succès"
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

export default Ajout;

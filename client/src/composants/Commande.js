import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import "../style/accueil.css";
import "../style/ajout.css";

class Commande extends Component {
  state = {
    medicaments: [],
    fournisseurs: [],

    nom_medicament: "",
    type: "",
    quantite: "",
    fournisseurSelectionne: "",
    showModal: false,
    message: null,
  };

  async componentDidMount() {
    const response = await axios.get("http://localhost:30500/medicament");
    const listeMedicament = response.data;
    //
    const response1 = await axios.get("http://localhost:30500/fournisseur");
    const listeFournisseur = response1.data;

    this.setState({
      medicaments: listeMedicament,
      fournisseurs: listeFournisseur,
    });
  }

  handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "fournisseur") {
      this.setState({ fournisseurSelectionne: value });
    } else {
      this.setState({ [id]: value });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { user } = this.props;

    const dataToSend = {
      nom_medicament: this.state.nom_medicament,
      type: this.state.type,
      quantite: this.state.quantite,
      fournisseurSelectionne: this.state.fournisseurSelectionne,
      emailPharmacien: user.email,
    };

    console.log(dataToSend);

    try {
      const response = await axios.post("/commander", dataToSend);
      // console.log(response.data.message);

      this.setState({
        nom_medicament: "",
        type: "",
        quantite: "",
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
    const { nom_medicament, type, quantite, fournisseurs } = this.state;

    const { user } = this.props;
    if (user == null) {
      return <Navigate to="/" />;
    }

    return (
      <body className="body-accueil">
        <div className="form-container">
          <h1 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
            Formulaire de Commande
          </h1>
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
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="fournisseur">
                    E-mail Fournisseur
                  </label>

                  {/*  */}
                  <select
                    id="fournisseur"
                    className="form-control"
                    value={this.state.fournisseurSelectionne}
                    onChange={this.handleInputChange}
                    required
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {fournisseurs.map((fournisseur) => (
                      <option key={fournisseur.email} value={fournisseur.email}>
                        {fournisseur.email}
                      </option>
                    ))}
                  </select>
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
            </div>

            <div className="row mb-4">
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="prenom_pharmacien">
                    Prenom & Nom Pharmacien
                  </label>
                  <input
                    type="text"
                    id="prenom_pharmacien"
                    className="form-control"
                    placeholder="Prenom Nom"
                    value={user.name}
                    readOnly={true}
                  />
                </div>
              </div>
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

export default Commande;

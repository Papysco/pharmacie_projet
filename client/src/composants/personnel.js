import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import "../style/accueil.css";
import "../style/ajout.css";
// import pilule from "../images/pilule.png";
// import pharma_icone from "../images/pharmacie_icone.png";

class Personnel extends Component {
  state = {
    pharmaciens: [],
    recherche: "",
    message: "",
    id_supprimer: null,

    //
    prenom: "",
    nom: "",
    admin: null,
    type_personne: null,
    email: "",
    mdp: "",
    telephone: "",

    //
    showModal: false,
    // message: null,

    // modification
    id_modif: null,
    prenom_modif: "",
    nom_modif: "",
    admin_modif: 0,
    email_modif: "",
    mdp_modif: "",
    telephone_modif: "",
    showModalModif: false,
  };

  async componentDidMount() {
    const response = await axios.get("http://localhost:30500/personnel");
    const listePharmacien = response.data;
    this.setState({ pharmaciens: listePharmacien });
  }

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.id_supprimer !== this.state.id_supprimer) {
      const dataToSend = { id: this.state.id_supprimer };
      let isValide = window.confirm("Voulez-vous supprimer ce pharmacien ?");

      if (isValide) {
        try {
          const response = await axios.post("/personnel_supprimer", dataToSend);

          if (response) {
            this.setState({ message: response.data.message });
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi des données:", error);
        }
      } else {
        this.setState({ id_supprimer: null });
      }
    }

    const response = await axios.get("http://localhost:30500/personnel");
    const listePharmacien = response.data;
    this.setState({ pharmaciens: listePharmacien });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      prenom: this.state.prenom,
      nom: this.state.nom,
      admin: this.state.admin,
      type_personne: this.state.type_personne,
      email: this.state.email,
      mdp: this.state.mdp,
      telephone: this.state.telephone,
    };

    try {
      const response = await axios.post("/ajouter-personnel", dataToSend);
      // console.log(response.data.message);

      this.setState({
        prenom: "",
        nom: "",
        type_personne: 0,
        email: "",
        mdp: "",
        telephone: "",
      });

      if (response) {
        this.setState({ message: response.data.message });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    }

    this.setState({ showModal: true });
  };

  handleModif = async (event) => {
    event.preventDefault();

    const dataToSend = {
      id: this.state.id_modif,
      prenom: this.state.prenom_modif,
      nom: this.state.nom_modif,
      admin: this.state.admin_modif,
      email: this.state.email_modif,
      mdp: this.state.mdp_modif,
      telephone: this.state.telephone_modif,
    };

    try {
      const response = await axios.post("/modifier-personnel", dataToSend);
      // console.log(response.data.message);
      window.alert("Modification avec succés !");

      this.setState({
        prenom_modif: "",
        nom_modif: "",
        email_modif: "",
        mdp_modif: "",
        telephone_modif: "",
      });

      if (response) {
        this.setState({ message: response.data.message });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
    }

    window.alert("Modification avec succes !");
    this.setState({ showModalModif: false });
  };

  render() {
    const { pharmaciens, prenom, nom, email, mdp, telephone } = this.state;
    const { user } = this.props;

    if (user == null) {
      return <Navigate to="/" />;
    }
    if (user.isAdmin === 0) {
      return <Navigate to="/dashbord" />;
    }

    return (
      <body className="body-accueil">
        <div
          className="table-vente-recent"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            fontSize: "1.2rem",
          }}
        >
          <h1 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
            Gestion de personnel
          </h1>
          <br />
          {/*  */}
          <form
            onSubmit={this.handleSubmit}
            style={{
              border: "2px dashed black",
              borderRadius: "30px",
              padding: "2rem",
            }}
          >
            <h3 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
              Formulaire d'ajout
            </h3>
            <br />
            <div className="row mb-4">
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="prenom">
                    Prenom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    className="form-control"
                    placeholder="Exemple : Modou"
                    value={prenom}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="nom">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    className="form-control"
                    placeholder="Diop"
                    value={nom}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="admin">
                    Admin <small>(Pharmacien *)</small>
                  </label>

                  {/*  */}
                  <select
                    id="admin"
                    className="form-control"
                    value={this.state.admin}
                    onChange={this.handleInputChange}
                  >
                    <option value="">Cliquer pour choisir !</option>
                    <option value={0}>Non</option>
                    <option value={1}>Oui</option>
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="type_personne">
                    Personnel
                  </label>

                  <select
                    id="type_personne"
                    className="form-control"
                    value={this.state.type_personne}
                    onChange={this.handleInputChange}
                    required
                  >
                    <option value=""> Pharmacien ou Fournisseur ? </option>
                    <option value={0}>pharmacien</option>
                    <option value={1}>fournisseur</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    placeholder="Exemple : modou@gmail.com"
                    value={email}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="mdp">
                    Mot de Passe <small>(Pharmacien *)</small>
                  </label>
                  <input
                    type="password"
                    id="mdp"
                    className="form-control"
                    placeholder=""
                    value={mdp}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="telephone">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    id="telephone"
                    className="form-control"
                    placeholder="Exemple : 77 343 89 00"
                    value={telephone}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
              </div>
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
          {/*  */}
          <br />
          <table className="table {table-striped} table-hover">
            <thead>
              <tr style={{ fontFamily: "ubuntu-regular", fontSize: "1.5rem" }}>
                <th scope="col">
                  {/* <img src={pharma_icone} alt="." style={{ width: "32px" }} /> */}
                  <i
                    className="bi bi-person-gear"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </th>
                <th scope="col">ID</th>
                <th scope="col">Prenom</th>
                <th scope="col">Nom</th>
                <th scope="col">Admin</th>
                <th scope="col">Telephone</th>
                <th scope="col">Email</th>
                {/* <th scope="col">Mot de passse</th> */}
                <th scope="col">Supprimer</th>
                <th scope="col">Modifier</th>
              </tr>
            </thead>
            <tbody>
              {pharmaciens.map((pharmacien) => {
                const admin = pharmacien.admin === 1 ? 1 : 0;

                return (
                  <tr key={pharmacien.id} style={{ cursor: "pointer" }}>
                    <th scope="row">
                      {/* <img src={pilule} alt="" /> */}
                      <i
                        className="bi bi-person-circle"
                        style={{ fontSize: "2rem" }}
                      ></i>
                    </th>
                    <td>{pharmacien.id_pharmacien}</td>
                    <td>{pharmacien.prenom}</td>
                    <td>{pharmacien.nom}</td>
                    <td>
                      <span
                        className={`badge badge-primary ${
                          admin === 1 ? `bg-danger` : `bg-success`
                        }`}
                        style={{
                          color: "white",
                          fontSize: 15,
                          marginLeft: "0.5rem",
                        }}
                      >
                        {admin === 1 ? (
                          <span>Admin</span>
                        ) : (
                          <span>No Admin</span>
                        )}
                      </span>
                    </td>
                    <td>{pharmacien.telephone} </td>
                    <td>{pharmacien.email}</td>
                    {/* <td>{pharmacien.mdp}</td> */}
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-md"
                        onClick={() => {
                          this.setState({
                            id_supprimer: pharmacien.id_pharmacien,
                          });
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-md"
                        onClick={() => {
                          this.setState({
                            id_modif: pharmacien.id_pharmacien,
                            prenom_modif: pharmacien.prenom,
                            nom_modif: pharmacien.nom,
                            admin_modif: pharmacien.admin,
                            email_modif: pharmacien.email,
                            mdp_modif: pharmacien.mdp,
                            telephone_modif: pharmacien.telephone,
                            showModalModif: true,
                          });
                        }}
                      >
                        modifier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

        {/* Modal modif */}
        <Modal
          isOpen={this.state.showModalModif}
          contentLabel=""
          className="modal-dialog modal-dialog-centered"
          style={{
            content: {
              width: "65%",
              height: "30rem",
              margin: "auto",
              marginTop: "10rem",
              backgroundColor: "#DCDCDC",
              padding: "2rem",
              paddingTop: "0px",
              borderRadius: "30px",
            },
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Modification des Informations</h2>
              <button
                type="button"
                className="close"
                onClick={() => this.setState({ showModalModif: false })}
                style={{ width: "2rem" }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleModif}>
                <br />
                <br />
                <div className="row mb-4">
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="prenom">
                        Prenom
                      </label>
                      <input
                        type="text"
                        id="prenom_modif"
                        className="form-control"
                        placeholder="Exemple : Modou"
                        value={this.state.prenom_modif}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="nom">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="nom_modif"
                        className="form-control"
                        placeholder="Diop"
                        value={this.state.nom_modif}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="admin">
                        Admin
                      </label>

                      {/*  */}
                      <select
                        id="admin_modif"
                        className="form-control"
                        value={this.state.admin_modif}
                        onChange={this.handleInputChange}
                      >
                        <option value="">Cliquer pour choisir !</option>
                        <option value={0}>Non</option>
                        <option value={1}>Oui</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="text"
                        id="email_modif"
                        className="form-control"
                        placeholder="Exemple : modou@gmail.com"
                        value={this.state.email_modif}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="mdp">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        id="mdp_modif"
                        className="form-control"
                        placeholder=""
                        value={this.state.mdp_modif}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="telephone">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        id="telephone_modif"
                        className="form-control"
                        placeholder="Exemple : 77 343 89 00"
                        value={this.state.telephone_modif}
                        onChange={this.handleInputChange}
                        required
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
                  Enregistrer
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => this.setState({ showModalModif: false })}
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

export default Personnel;

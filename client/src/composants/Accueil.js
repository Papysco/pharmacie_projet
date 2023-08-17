import React, { Component } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../style/accueil.css";
import pilule from "../images/pilule.png";
import pharma_icone from "../images/pharmacie_icone.png";

class DashboardCard extends Component {
  render() {
    const { icon, title, value, pourcentage, color } = this.props;

    return (
      <div className={`col-xl-3 col-lg-6`}>
        <div className={`card l-bg-${color}`} style={{ height: "10rem" }}>
          <div className="card-statistic-3 p-4">
            <div className="card-icon card-icon-large">
              <i className={icon}></i>
            </div>
            <div className="mb-4">
              <h5 className="card-title mb-0">{title}</h5>
            </div>
            <div className="row align-items-center mb-2 d-flex">
              <div className="col-8">
                <h2 className="d-flex align-items-center mb-0">{value}</h2>
              </div>
              <div className="col-4 text-right">
                <span>
                  {pourcentage}% <i className="fa fa-arrow-up"></i>
                </span>
              </div>
            </div>
            <div
              className="progress mt-1 "
              data-height="8"
              style={{ height: "8px" }}
            >
              <div
                className={`progress-bar l-bg-${color}`}
                role="progressbar"
                data-width={`${pourcentage}%`}
                aria-valuenow={pourcentage}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${pourcentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Accueil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      medicaments: [
        {
          id: 1,
          nom: "Medicament 1",
          statut: 0,
          type: "Type 1",
          prix: "1000 FCFA",
        },
      ],
      ventesParJour: [
        { jour: "Lundi", ventes: 10 },
        { jour: "Mardi", ventes: 8 },
        { jour: "Mercredi", ventes: 15 },
        { jour: "Jeudi", ventes: 5 },
        { jour: "Vendredi", ventes: 12 },
        { jour: "Samedi", ventes: 18 },
        { jour: "Dimanche", ventes: 7 },
      ],
      nbrVente: 0,
      nbrTotalMedoc: 0,
      nbrMedocAlerte: 0,
      nbrMedocPerime: 0,
    };
  }

  async componentDidMount() {
    const response = await axios.get("http://localhost:30500/nombreVente");
    const response1 = await axios.get(
      "http://localhost:30500/nombreMedicament"
    );
    const response2 = await axios.get(
      "http://localhost:30500/nombreMedicamentAlerte"
    );
    const response3 = await axios.get(
      "http://localhost:30500/nombreMedicamentPerime"
    );
    const nbrVente = response.data[0].count;
    const nbrTotalMedoc = response1.data[0].count;
    const nbrMedocAlerte = response2.data[0].count;
    const nbrMedocPerime = response3.data[0].count;

    this.setState({
      nbrVente: nbrVente,
      nbrTotalMedoc: nbrTotalMedoc,
      nbrMedocAlerte: nbrMedocAlerte,
      nbrMedocPerime: nbrMedocPerime,
    });

    console.log(nbrVente);
    console.log(nbrTotalMedoc);
  }

  render() {
    const { medicaments, selectedDate, ventesParJour } = this.state;

    return (
      <body
        style={{
          backgroundColor: "#f2edf3",
          paddingTop: "2rem",
          paddingBottom: "5rem",
        }}
      >
        <div className="resume">
          <div className="col-md-12">
            <div className="row resume-row">
              <DashboardCard
                icon="fas fa-shopping-cart"
                title="Vente d'aujourdhui"
                value={this.state.nbrVente}
                pourcentage="100"
                color="cherry"
              />
              <DashboardCard
                icon="fas fa-users"
                title="Total Medicaments"
                value={this.state.nbrTotalMedoc}
                pourcentage="100"
                color="blue-dark"
              />
              <DashboardCard
                icon="fas fa-ticket-alt"
                title="Medicaments en alerte"
                value={this.state.nbrMedocAlerte}
                pourcentage={
                  (this.state.nbrMedocAlerte / this.state.nbrTotalMedoc) * 100
                }
                color="green-dark"
              />
              <DashboardCard
                icon="fas fa-dollar-sign"
                title="Médicaments perimés"
                value={this.state.nbrMedocPerime}
                pourcentage={
                  (this.state.nbrMedocPerime / this.state.nbrTotalMedoc) * 100
                }
                color="orange-dark"
              />
            </div>
          </div>
        </div>
        <div className="table-vente-recent">
          <h2 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
            Ventes Récentes
          </h2>
          <style>
            {`
              .date-picker {
                display: flex;
                align-items: center;
                margin-top: 1rem;              
              }                  
            `}
          </style>
          <div className="date-picker">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => this.setState({ selectedDate: date })}
              dateFormat="dd/MM/yyyy"
              style={{ border: "2px solid blue" }}
            />
            <i
              className="bi bi-calendar-date"
              style={{ fontSize: "1.9rem", marginLeft: "0.5rem" }}
            ></i>
          </div>
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
              </tr>
            </thead>
            <tbody>
              {medicaments.map((medicament) => (
                <tr key={medicament.id}>
                  <th scope="row">
                    <img src={pilule} alt="" />
                  </th>
                  <td>{medicament.nom}</td>
                  <td>{medicament.type}</td>
                  <td>
                    {
                      <span
                        className="badge badge-primary"
                        style={{
                          color: "white",
                          backgroundColor:
                            medicament.statut === 1 ? "red" : null,
                          fontSize: 15,
                          marginLeft: "0.5rem",
                        }}
                      >
                        {medicament.statut === 1 ? (
                          <span>En alerte</span>
                        ) : null}
                      </span>
                    }
                  </td>
                  <td>{medicament.prix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Diagramme en bande pour les ventes par jour */}
        <div className="ventes-par-jour">
          <h2 style={{ fontFamily: "ubuntu-regular" }}>
            Ventes par jour de la semaine
          </h2>
          <div className="bar-chart">
            {ventesParJour.map((jour) => (
              <div
                key={jour.jour}
                className="bar"
                style={{
                  height: `${jour.ventes * 20}px`,
                  backgroundColor: "#4286f4",
                  fontSize: "2rem",
                }}
              >
                {jour.ventes}
              </div>
            ))}
          </div>
          <div className="jours-de-semaine">
            {ventesParJour.map((jour) => (
              <div key={jour.jour} className="jour">
                {jour.jour}
              </div>
            ))}
          </div>
        </div>
        {/* <div>
          <h2>Welcome, {user ? user.name : "Guest"}!</h2>
          {user && user.isAdmin && <p>You are an admin.</p>}
        </div> */}
      </body>
    );
  }
}

export default Accueil;

import React, { Component } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { Navigate } from "react-router-dom";
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
      // selectedDate: null,
      dateHttp: "",
      medicaments: [],
      nbrVente: 0,
      nbrTotalMedoc: 0,
      nbrMedocAlerte: 0,
      nbrMedocPerime: 0,
    };
  }

  async componentDidMount() {
    // let date = new Date();
    // date = this.convertDate(date);
    // alert(date);

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
    const response4 = await axios.get(
      `http://localhost:30500/venteToDay`
    );

    const nbrVente = response.data[0].count;
    const nbrTotalMedoc = response1.data[0].count;
    const nbrMedocAlerte = response2.data[0].count;
    const nbrMedocPerime = response3.data[0].count;
    const listeVente = response4.data;

    this.setState({
      nbrVente: nbrVente,
      nbrTotalMedoc: nbrTotalMedoc,
      nbrMedocAlerte: nbrMedocAlerte,
      nbrMedocPerime: nbrMedocPerime,
      medicaments: listeVente,
    });
  }

  async componentDidUpdate(prevProps,prevState) {
    if (prevState.selectedDate !== this.state.selectedDate ) {
      // console.log(this.state.dateHttp);

      const response4 = await axios.get(
        `http://localhost:30500/venteRecentes?date=${this.state.dateHttp}`
      );
      const listeVente = response4.data;
  
      this.setState({
        medicaments: listeVente,
      });
    }
   
  }

  handleDateChange = (date) => {
    if (date) {
      let datehttp = this.convertDate(date);

      // console.log(datehttp);
      this.setState({
        selectedDate: date,
        dateHttp: datehttp,
      });
    }
  };

  convertDate = (date) => {
    let annee = date.getFullYear();
    let mois = date.getMonth() + 1;
    let jour = date.getDate();

    if (mois < 10) {
      mois = "0" + mois.toString();
    }
    
    if (jour < 10) {
      jour = "0" + jour.toString();
    }
    let datehttp = annee + "-" + mois + "-" + jour;

    return datehttp;
  };

  render() {
    const { medicaments } = this.state;
    const { user } = this.props;

    if (user == null) {
      return <Navigate to="/" />;
    }

    return (
      <body className="body-accueil">
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
                color="green-dark"
              />
              <DashboardCard
                icon="fas fa-ticket-alt"
                title="Medicaments en alerte"
                value={this.state.nbrMedocAlerte}
                pourcentage={(
                  (this.state.nbrMedocAlerte / this.state.nbrTotalMedoc) *
                  100
                ).toFixed(0)}
                color="orange-dark"
              />
              <DashboardCard
                icon="fas fa-dollar-sign"
                title="Médicaments perimés"
                value={this.state.nbrMedocPerime}
                pourcentage={(
                  (this.state.nbrMedocPerime / this.state.nbrTotalMedoc) *
                  100
                ).toFixed(0)}
                color="red-dark"
              />
            </div>
          </div>
        </div>
        <div className="table-vente-recent">
          <h1 style={{ fontFamily: "ubuntu-regular", textAlign: "center" }}>
            Ventes Récentes
          </h1>

          <div className="date-picker">
            <DatePicker
              selected={this.state.selectedDate}
              onChange={this.handleDateChange}
              dateFormat="yyyy/MM/dd"
              style={{ border: "2px solid black" }}
            />
            <i
              className="bi bi-calendar-date"
              style={{ fontSize: "1.9rem", marginLeft: "0.5rem" }}
            ></i>
          </div>

          <br />
          <table className="table table-striped table-hover">
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
              {medicaments.map((medicament) => {
                const isAlert =
                  new Date(medicament.date_expiration) < Date.now();
                const statut = isAlert ? 1 : 0;

                return (
                  <tr key={medicament.id} style={{ cursor: "pointer" }}>
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
                          <span>normal</span>
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

        {/* <div>
          <h2>Welcome, {user ? user.name : "Guest"}!</h2>
          {user && user.isAdmin && <p>You are an admin.</p>}
        </div> */}
      </body>
    );
  }
}

export default Accueil;

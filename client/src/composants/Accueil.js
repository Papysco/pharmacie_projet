import React from "react";
import { useState } from "react";
// import { Link } from "react-router-dom";
import "../style/accueil.css";
import pilule from "../images/pilule.png";
import pharma_icone from "../images/pharmacie_icone.png";

function DashboardCard({ icon, title, value, pourcentage, color }) {
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

function Accueil({ user }) {
  const [medicaments, setMedicaments] = useState([
    {
      id: 1,
      nom: "Medicament 1",
      statut: 0,
      type: "Type 1",
      prix: "1000 FCFA",
    },
    {
      id: 2,
      nom: "Medicament 2",
      statut: 1,
      type: "Type 2",
      prix: "1000 FCFA",
    },
    {
      id: 3,
      nom: "Medicament 3",
      statut: 0,
      type: "Type 1",
      prix: "1000 FCFA",
    },
    {
      id: 4,
      nom: "Medicament 4",
      statut: 0,
      type: "Type 2",
      prix: "1000 FCFA",
    },
    {
      id: 5,
      nom: "Medicament 5",
      statut: 1,
      type: "Type 1",
      prix: "1000 FCFA",
    },
  ]);

  return (
    <body>
      <div className="resume">
        <div className="col-md-12">
          <div className="row">
            <DashboardCard
              icon="fas fa-shopping-cart"
              title="Vente d'aujourdhui"
              value="15"
              pourcentage="12.5"
              color="cherry"
            />
            <DashboardCard
              icon="fas fa-users"
              title="Total Medicaments"
              value="25"
              pourcentage="100"
              color="blue-dark"
            />
            <DashboardCard
              icon="fas fa-ticket-alt"
              title="Medicaments en alerte"
              value="5"
              pourcentage="10"
              color="green-dark"
            />
            <DashboardCard
              icon="fas fa-dollar-sign"
              title="Médicaments perimés"
              value="2"
              pourcentage="1.5"
              color="orange-dark"
            />
          </div>
        </div>
      </div>
      <div className="table-vente-recent">
        <h2 style={{ fontFamily: "ubuntu-regular" }}>Ventes Récentes</h2>
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
                        backgroundColor: medicament.statut === 1 ? "red" : null,
                        fontSize: 15,
                        marginLeft: "0.5rem",
                      }}
                    >
                      {medicament.statut === 1 ? <span>En alerte</span> : null}
                    </span>
                  }
                </td>
                <td>{medicament.prix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Welcome, {user ? user.name : "Guest"}!</h2>
        {user && user.isAdmin && <p>You are an admin.</p>}
      </div>
    </body>
  );
}

export default Accueil;

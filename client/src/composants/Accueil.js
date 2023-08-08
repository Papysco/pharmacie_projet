import React, { Component } from "react";
import { useState } from "react";
// import { Link } from "react-router-dom";
import "../style/accueil.css";

function DashboardCard({ icon, title, value, percentage, color }) {
  return (
    <div className={`col-xl-3 col-lg-6`}>
      <div className={`card l-bg-${color}`}>
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
                {percentage}% <i className="fa fa-arrow-up"></i>
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
              data-width={`${percentage}%`}
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Accueil() {
  const [medicaments, setMedicaments] = useState([
    { id: 1, nom: "Medicament 1", type: "Type 1", prix: "1000 FCFA" },
    { id: 2, nom: "Medicament 2", type: "Type 2", prix: "1000 FCFA" },
    { id: 3, nom: "Medicament 3", type: "Type 1", prix: "1000 FCFA" },
    { id: 4, nom: "Medicament 4", type: "Type 2", prix: "1000 FCFA" },
    { id: 5, nom: "Medicament 5", type: "Type 1", prix: "1000 FCFA" },
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
              percentage="12.5"
              color="cherry"
            />
            <DashboardCard
              icon="fas fa-users"
              title="Total Medicaments"
              value="25"
              percentage="100"
              color="blue-dark"
            />
            <DashboardCard
              icon="fas fa-ticket-alt"
              title="Medicaments en alerte"
              value="5"
              percentage="10"
              color="green-dark"
            />
            <DashboardCard
              icon="fas fa-dollar-sign"
              title="Médicaments perimés"
              value="2"
              percentage="1.5"
              color="orange-dark"
            />
          </div>
        </div>
      </div>
      <div className="table-vente-recent">
        <h2 style={{ fontFamily: "ubuntu-regular" }}>Ventes Recentes</h2>
        <br />
        <table className="table table-striped">
          <thead>
            <tr style={{ fontFamily: "ubuntu-regular", fontSize: "1.5rem" }}>
              <th scope="col">#</th>
              <th scope="col">Nom Medicament</th>
              <th scope="col">Type</th>
              <th scope="col">Statut</th>
              <th scope="col">Prix Unitaire</th>
            </tr>
          </thead>
          <tbody>
            {medicaments.map((medicament) => (
              <tr key={medicament.id}>
                <th scope="row">{medicament.id}</th>
                <td>{medicament.nom}</td>
                <td>{medicament.type}</td>
                <td>{<span className="badge badge-primary">En régle</span>}</td>
                <td>{medicament.prix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </body>
  );
}

export default Accueil;

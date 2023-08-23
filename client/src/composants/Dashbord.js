import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../style/dashbord.css";
import logo from "../images/Pharmacie_small.svg";

// import axios from "axios";

class DashBord extends Component {
  render() {
    const links = [
      { to: "/dashbord", text: "Accueil", icon: "bi-house-door-fill" },
      { to: "/dashbord/vendre", text: "Vendre", icon: "bi-bag-fill" },
      { to: "/dashbord/ajouter", text: "Ajouter", icon: "bi-plus-circle-fill" },
      { to: "/dashbord/stock", text: "Stock", icon: "bi-view-list" },
      {
        to: "/dashbord/commander",
        text: "Commander",
        icon: "bi-cart-check-fill",
      },
      {
        to: "/dashbord/medicaments-perimes",
        text: "Statut Médicaments",
        icon: "bi-capsule-pill",
      },
      {
        to: "/dashbord/gestion-personnel",
        text: "Gestion personnel",
        icon: "bi-person-gear",
      },
    ];

    return (
      <nav className="nav-bloc">
        <img
          src={logo}
          style={{ width: "250px", height: "170px" }}
          className="logo-dashboard"
          alt="logo"
        />
        <ul className="nav">
          {links.map((link, index) => (
            <li className="nav-item" key={index}>
              <Link className="link" to={link.to}>
                {link.text}
              </Link>{" "}
              <i className={`bi ${link.icon}`} style={{ fontSize: 18 }}></i>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-primary btn-dashboard"
          data-bs-toggle="button"
        >
          Déconnecter
        </button>
      </nav>
    );
  }
}

export default DashBord;

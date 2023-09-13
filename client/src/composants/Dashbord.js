import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import "../style/dashbord.css";
import "../style/accueil.css";
import logo from "../images/Pharmacie_small.svg";

// import axios from "axios";

class DashBord extends Component {
  deconnecter = () => <Navigate to="/" />;

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
        to: "/dashbord/personnel",
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
              <i className={`bi ${link.icon}`} style={{ fontSize: 20 }}></i>
            </li>
          ))}
        </ul>

        <a
          className="link btn btn-primary btn-dashboard"
          style={{ fontSize: "1.2rem" }}
          href="/"
          onClick={this.deconnecter}
        >
          Déconnecter
        </a>
      </nav>
    );
  }
}

export default DashBord;

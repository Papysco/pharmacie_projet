import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../style/dashbord.css";
import logo from "../images/Pharmacie_small.svg";

class DashBord extends Component {
  render() {
    return (
      <nav className="nav-bloc">
        <img
          src={logo}
          style={{ width: "250px", height: "170px" }}
          className="logo-dashboard"
          alt="logo"
        />
        <ul className="nav">
          <li className="nav-item">
            <Link className="link" to="/dashbord">
              Accueil
            </Link>{" "}
            <i className="bi bi-house-door-fill" style={{ fontSize: 18 }}></i>
          </li>
          <li className="nav-item">
            <Link className="link" to="/dashbord/vendre">
              Vendre
            </Link>{" "}
            <i className="bi bi-bag-fill" style={{ fontSize: 18 }}></i>
          </li>
          <li className="nav-item">
            <Link className="link" to="/dashbord/ajouter">
              Ajouter
            </Link>{" "}
            <i className="bi bi-plus-circle-fill" style={{ fontSize: 18 }}></i>
          </li>
          <li className="nav-item">
            <Link className="link" to="/dashbord/stock">
              Stock
            </Link>{" "}
            <i className="bi bi-view-list" style={{ fontSize: 18 }}></i>
          </li>
          <li className="nav-item">
            <Link className="link" to="/dashbord/commander">
              Commander
            </Link>{" "}
            <i className="bi bi-cart-check-fill" style={{ fontSize: 18 }}></i>
          </li>
          <li className="nav-item">
            <Link className="link" to="/dashbord/medicaments-perimes">
              Statut Médicaments
            </Link>{" "}
            <i className="bi bi-capsule-pill" style={{ fontSize: 18 }}></i>
          </li>
          <li className="nav-item">
            <Link className="link" to="/dashbord/gestion-personnel">
              Gestion personnel
            </Link>{" "}
            <i className="bi bi-person-gear" style={{ fontSize: 18 }}></i>
          </li>
        </ul>
        <button
          type="button"
          className="btn btn-primary btn-dashboard"
          data-bs-toggle="button"
        >
          Deconnecter
        </button>
      </nav>
    );
  }
}

export default DashBord;

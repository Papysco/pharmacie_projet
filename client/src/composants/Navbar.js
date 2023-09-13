import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import "../style/navbar.css";
import axios from "axios";
import logo from "../images/Pharmacie_small.svg";

class Navbar extends Component {
  state = {
    nbrMedocAlerte: 0,
    nbrMedocPerime: 0,
  };

  async componentDidMount() {
    const response = await axios.get(
      "http://localhost:30500/nombreMedicamentAlerte"
    );
    const response1 = await axios.get(
      "http://localhost:30500/nombreMedicamentPerime"
    );
    const nbrMedocAlerte = response.data[0].count;
    const nbrMedocPerime = response1.data[0].count;

    this.setState({
      nbrMedocAlerte: nbrMedocAlerte,
      nbrMedocPerime: nbrMedocPerime,
    });
  }

  render() {
    const { user } = this.props;

    if (user == null) {
      return <Navigate to="/" />;
    }

    return (
      <nav className="navbar navbar-light bg-light">
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Rechercher"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0 navbar-btn"
            type="submit"
          >
            Rechercher
          </button>
        </form>

        <ul className="navbar-ul">
          <li className="navbar-item">
            <Link className="link" to="/dashbord/medicaments-perimes">
              <i className="bi bi-bell-fill" style={{ fontSize: 25 }}></i>
              <span
                className="badge badge-secondary"
                style={{
                  color: "white",
                  backgroundColor: "red",
                  fontSize: 12,
                  marginLeft: "0.15rem",
                }}
              >
                {this.state.nbrMedocAlerte}
              </span>
            </Link>
          </li>

          <li className="navbar-item nav-profile dropdown">
            <div className="nav-profile-img" style={{ marginTop: "0.7rem" }}>
              <img
                src={logo}
                style={{ width: "70px", height: "70px" }}
                alt="logo"
              />
            </div>
            <div className="nav-profile-text" style={{ marginLeft: "0.7rem" }}>
              <p className="mb-1 text-black font-ubuntu">{user.name}</p>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;

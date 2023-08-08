import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css";
import logo from "../images/Pharmacie_small.svg";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Rechercher"
            aria-label="Search"
          />
          <br />

          <button
            className="btn btn-outline-success my-2 my-sm-0 navbar-btn"
            type="submit"
          >
            Rechercher
          </button>
        </form>

        <ul className="navbar-ul">
          <li className="navbar-item">
            <Link className="link" to="/">
              <i className="bi bi-bell-fill" style={{ fontSize: 25 }}></i>
            </Link>{" "}
          </li>
          <li className="navbar-item">
            <Link className="link" to="/vendre">
              <i
                className="bi bi-chat-left-dots-fill"
                style={{ fontSize: 25 }}
              ></i>
            </Link>{" "}
          </li>
          {/* -------------------- */}
          <li className="navbar-item nav-profile dropdown">
            <div className="nav-profile-img" style={{ marginTop: "0.7rem" }}>
              <img
                src={logo}
                style={{ width: "70px", height: "70px" }}
                alt="logo"
              />
            </div>
            <div className="nav-profile-text" style={{ marginLeft: "0.7rem" }}>
              <p
                className="mb-1 text-black"
                style={{ fontFamily: "ubuntu-regular", color: "#3e4b5b" }}
              >
                Ibrahima Fall
              </p>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;

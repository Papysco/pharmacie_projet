import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../style/login.css";
import logo from "../images/Pharmacie_small.svg";

class Login extends Component {
  state = {
    login: "",
    password: "",
    error: false,
    authenticated: false,
    info_login: [],
  };

  async componentDidMount() {
    const response = await axios.get("http://localhost:30500/personnel");
    const listePharmacien = response.data;
    this.setState({ info_login: listePharmacien });
  }

  handleLogin = (event) => {
    event.preventDefault();
    const { login, password } = this.state;
    const { onLogin } = this.props;

    let found = false;

    for (let i = 0; i < this.state.info_login.length; i++) {
      let element = this.state.info_login[i];

      if (element.email === login && element.mdp === password) {
        found = true;

        const user = {
          email: login,
          name: element.prenom + " " + element.nom,
          isAdmin: true,
        };

        onLogin(user);
        this.setState({ error: false, authenticated: true });
      }
    }

    if (!found) {
      this.setState({ error: true });
    }
  };

  onChangeLogin = (event) => {
    this.setState({ login: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  handleError = () => {
    const { error } = this.state;

    if (error === true) {
      return (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <div>Identifiant ou Mot de Passe Incorrect !</div>
        </div>
      );
    } else {
      return;
    }
  };

  render() {
    const { authenticated } = this.state;

    if (authenticated) {
      return <Navigate to="/dashbord" />;
    }

    return (
      <section className="h-100 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card rounded-3 text-black">
                <div className="card-body p-md-5 mx-md-4">
                  <div className="text-center">
                    <img
                      src={logo}
                      style={{ width: "200px", height: "160px" }}
                      alt="logo"
                    />
                  </div>

                  <form>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form2Example11">
                        Identifiant
                      </label>
                      <input
                        type="email"
                        id="identifiant"
                        className="form-control"
                        placeholder="Adresse E-mail"
                        required
                        value={this.state.login}
                        onChange={this.onChangeLogin}
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form2Example22">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder=""
                        className="form-control"
                        aria-required
                        value={this.state.password}
                        onChange={this.onChangePassword}
                      />
                    </div>

                    <div className="text-center pt-2 mb-5 pb-1">
                      <br />
                      <button
                        className="btn btn-primary btn-block fa-lg mb-3 blue_button"
                        type="button"
                        onClick={this.handleLogin}
                        style={{ fontSize: "1.2rem" }}
                      >
                        Connexion
                      </button>
                      <br />
                      {this.handleError()}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;

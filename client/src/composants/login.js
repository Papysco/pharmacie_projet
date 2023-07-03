import React, { useState } from "react";
import "../style/login.css";
import logo from "../images/Pharmacie.svg";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    // Votre logique de connexion ici

    // Exemple d'erreur de connexion
    setError(true);
  };

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
                    style={{ width: "350px", height: "250px" }}
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
                      placeholder="adresse e-mail"
                      required
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
                    />
                  </div>

                  <div className="text-center pt-2 mb-5 pb-1">
                    <button
                      className="btn btn-primary btn-block fa-lg mb-3 blue_button"
                      type="button"
                      onClick={handleLogin}
                    >
                      Se connecter
                    </button>
                    <br />
                    <br />
                    {error && (
                      <div
                        className="alert alert-danger d-flex align-items-center"
                        role="alert"
                      >
                        <div>Identifiant ou mot de passe incorrect !</div>
                      </div>
                    )}
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

export default Login;

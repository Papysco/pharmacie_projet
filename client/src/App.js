import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./composants/Navbar";
import DashBord from "./composants/Dashbord";
import Login from "./composants/Login";
import "../src/style/app.css";
import Accueil from "./composants/Accueil";
import Stock from "./composants/Stock";
import Statut from "./composants/Statut";
import Ajout from "./composants/ajout";

class MainLayout extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className="App">
        <DashBord />
        <section className="section">
          <header className="app-header">
            <Navbar />
          </header>
          {children}
        </section>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  handleLogin = (user) => {
    this.setState({ user: user });
  };

  render() {
    const { user } = this.state;

    return (
      <Routes>
        <Route path="/" element={<Login onLogin={this.handleLogin} />} />
        <Route
          path="/dashbord/*"
          element={
            <MainLayout>
              <Routes>
                <Route index element={<Accueil user={user} />} />
                <Route path="stock" element={<Stock user={user} />} />
                <Route
                  path="medicaments-perimes"
                  element={<Statut user={user} />}
                />
                <Route path="Ajouter" element={<Ajout user={user} />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    );
  }
}

export default App;

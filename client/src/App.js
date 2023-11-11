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
import Commande from "./composants/Commande";
import Vendre from "./composants/Vendre";
import Personnel from "./composants/personnel";
import Rupture from "./composants/Rupture";

class MainLayout extends Component {
  render() {
    const { children, user } = this.props;

    return (
      <div className="App">
        <DashBord />
        <section className="section">
          <header className="app-header">
            <Navbar user={user} />
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
            <MainLayout user={user}>
              <Routes>
                <Route index element={<Accueil user={user} />} />
                <Route path="stock" element={<Stock user={user} />} />
                <Route path="rupture" element={<Rupture user={user} />} />
                <Route
                  path="medicaments-perimes"
                  element={<Statut user={user} />}
                />
                <Route path="Ajouter" element={<Ajout user={user} />} />
                <Route path="commander" element={<Commande user={user} />} />
                <Route path="vendre" element={<Vendre user={user} />} />
                <Route path="personnel" element={<Personnel user={user} />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    );
  }
}

export default App;

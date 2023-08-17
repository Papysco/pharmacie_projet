import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./composants/Navbar";
import DashBord from "./composants/Dashbord";
import Login from "./composants/Login";
import "../src/style/app.css";
import Accueil from "./composants/Accueil";

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
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    );
  }
}

export default App;

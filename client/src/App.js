import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./composants/Navbar";
import DashBord from "./composants/Dashbord";
import Login from "./composants/Login";
import "../src/style/app.css";
import Accueil from "./composants/Accueil";

function MainLayout({ children }) {
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashbord/*"
        element={
          <MainLayout>
            <Routes>
              <Route index element={<Accueil />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;

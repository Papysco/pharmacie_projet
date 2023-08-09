import React, { useState } from "react";
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
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
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

export default App;

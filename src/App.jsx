// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Calendrier from "./pages/Calendrier";
import Rapports from "./pages/Rapports";
import Parametres from "./pages/Paramètres";
import Interventions from "./pages/Interventions";
import Profil from "./pages/Profil";
import AccountUser from "./pages/CompteUtilisateur";
import Produit from "./pages/Produit";
import Client from "./pages/Client";
import LoginPage from "./pages/LoginPage";
import Accueil from "./pages/Accueil";
import InterventionForm from "./pages/InterventionForm";
import IncidentForm from "./pages/IncidentForm";
import Incident from "./pages/Incident";
import Dashboard from "./pages/Dashboard";

// Toastify global
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      {/* Toast global pour toutes les pages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Calendrier />} />
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/compte_utilisateur" element={<AccountUser />} />
          <Route path="/produit" element={<Produit />} />
          <Route path="/client" element={<Client />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/ajouter_intervention" element={<InterventionForm />} />
          <Route path="/declarer_incident" element={<IncidentForm />} />
          <Route path="/incidents" element={<Incident />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;

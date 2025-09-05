// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Calendrier from "./pages/Calendrier"
import Rapports from "./pages/Rapports"
import Parametres from "./pages/Paramètres"
import Interventions from "./pages/Interventions"
import InterventionsTerminees from "./pages/Intervention_terminees"
import Profil from "./pages/Profil"
import Incident from "./pages/Incident"
import AccountUser from "./pages/AccountUser"
import Produit from "./pages/Produit"
import Client from "./pages/Client"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <Router>
      <Routes>
        {/* Login en dehors du Layout */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Toutes les autres pages avec le Layout */}
        <Route element={<Layout />}>
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/interventions_terminees" element={<InterventionsTerminees />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/incident" element={<Incident />} />
          <Route path="/compte_utilisateur" element={<AccountUser />} />
          <Route path="/produit" element={<Produit />} />
          <Route path="/client" element={<Client />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

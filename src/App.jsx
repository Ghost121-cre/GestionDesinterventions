// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Calendrier from "./pages/Calendrier"
import Rapports from "./pages/Rapports"
import Parametres from "./pages/Paramètres"
import Interventions from "./pages/Interventions"
import Profil from "./pages/Profil"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/calendrier" element={<Calendrier />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/intervention" element={<Interventions />} />
          <Route path="/profil" element={<Profil />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

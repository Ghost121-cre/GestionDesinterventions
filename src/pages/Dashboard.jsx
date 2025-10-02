import React, { useState } from "react";
import Interventions from "./Interventions";
import Incident from "./Incident";

function Dashboard() {
  const [incidentNonResolus, setIncidentNonResolus] = useState([]);
  const [incidentsResolus, setIncidentsResolus] = useState([]);

  // 👉 Fonction appelée quand une intervention est terminée
  const handleTerminerIntervention = (intervention) => {
    const nouvelIncident = {
      id: Date.now(),
      contenu: intervention.titre,
      client: intervention.client || "Client démo",
      produit: intervention.produit || "Produit démo",
      date_survenu: new Date().toISOString().split("T")[0],
      statut: "résolu",
    };

    setIncidentsResolus((prev) => [...prev, nouvelIncident]);
  };

  return (
    <div>
      <h2 className="text-center mb-4">Tableau de bord Démo</h2>
      <div className="row">
        <div className="col-md-6">
          <Interventions onTerminer={handleTerminerIntervention} />
        </div>
        <div className="col-md-6">
          <Incident
            incidentNonResolus={incidentNonResolus}
            incidentsResolus={incidentsResolus}
            setIncidentNonResolus={setIncidentNonResolus}
            setIncidentsResolus={setIncidentsResolus}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

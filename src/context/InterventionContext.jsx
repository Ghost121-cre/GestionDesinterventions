// src/context/InterventionContext.jsx
import React, { createContext, useContext, useState } from "react";
import { useIncident } from "./IncidentContext";

const InterventionContext = createContext();
export const useInterventions = () => useContext(InterventionContext);

export const InterventionProvider = ({ children }) => {
  const [interventions, setInterventions] = useState([]);
  const { handleMarkResolved } = useIncident(); // ✅ fonction du contexte incident

  // Ajouter une intervention
  const addIntervention = (data) => {
    const id = interventions.length ? interventions[interventions.length - 1].id + 1 : 1;
    setInterventions((prev) => [
      ...prev,
      { id, ...data, statut: "En attente" },
    ]);
  };

  // Démarrer une intervention
  const startIntervention = (id) => {
    setInterventions((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, statut: "En cours", startedAt: new Date().toISOString() } : i
      )
    );
  };

  // ✅ Terminer intervention et résoudre incident lié
  const finishIntervention = (id) => {
    setInterventions((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          // Résoudre l'incident si existe
          if (i.incidentId) {
            handleMarkResolved(Number(i.incidentId)); 
          }
          return { ...i, statut: "Terminé", endedAt: new Date().toISOString() };
        }
        return i;
      })
    );
  };

  // Supprimer intervention
  const deleteIntervention = (id) => {
    setInterventions((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <InterventionContext.Provider
      value={{
        interventions,
        addIntervention,
        startIntervention,
        finishIntervention,
        deleteIntervention,
      }}
    >
      {children}
    </InterventionContext.Provider>
  );
};

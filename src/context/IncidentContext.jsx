import React, { createContext, useContext, useState } from "react";

const IncidentContext = createContext();

export const useIncident = () => useContext(IncidentContext);

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);

  // Ajouter un incident
  const addIncident = (data) => {
    const id = incidents.length ? incidents[incidents.length - 1].id + 1 : 1;
    setIncidents((prev) => [
      ...prev,
      { id, ...data, statut: "non résolu" },
    ]);
  };

  // ❌ Supprimer
  const handleDelete = (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      setIncidents((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // ✅ Marquer comme résolu AVEC DATE
  const handleMarkResolved = (id) => {
    setIncidents((prev) =>
      prev.map((i) => 
        i.id === id ? { 
          ...i, 
          statut: "résolu",
          date_resolu: new Date().toISOString().split('T')[0] // Date du jour au format YYYY-MM-DD
        } : i
      )
    );
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        addIncident,
        handleDelete,
        handleMarkResolved,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
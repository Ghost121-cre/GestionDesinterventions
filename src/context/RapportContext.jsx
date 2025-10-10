// src/context/RapportContext.jsx
import React, { createContext, useContext, useState } from "react";

const RapportContext = createContext();
export const useRapports = () => useContext(RapportContext);

export const RapportProvider = ({ children }) => {
  const [rapports, setRapports] = useState([]);
  const [nextRapportId, setNextRapportId] = useState(1);

  // Ajouter un rapport
  const addRapport = (rapportData) => {
    const id = nextRapportId.toString().padStart(3, '0'); // Format "001", "002", etc.
    const newRapport = { ...rapportData, id };
    
    setRapports((prev) => [...prev, newRapport]);
    setNextRapportId(prev => prev + 1);
  };

  // Supprimer un rapport
  const deleteRapport = (id) => {
    setRapports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RapportContext.Provider value={{ rapports, addRapport, deleteRapport }}>
      {children}
    </RapportContext.Provider>
  );
};
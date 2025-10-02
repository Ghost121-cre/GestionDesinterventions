import React, { createContext, useContext, useState } from "react";

const RapportContext = createContext();
export const useRapports = () => useContext(RapportContext);

export const RapportProvider = ({ children }) => {
  const [rapports, setRapports] = useState([]);

  // Ajouter un rapport
  const addRapport = (rapport) => {
    setRapports((prev) => [...prev, rapport]);
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

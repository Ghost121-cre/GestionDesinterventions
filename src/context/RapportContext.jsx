import React, { createContext, useContext, useState, useEffect } from "react";
import { rapportService } from "../services/rapportService"; // Import corrigé

const RapportContext = createContext();
export const useRapports = () => useContext(RapportContext);

export const RapportProvider = ({ children }) => {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les rapports au démarrage
  useEffect(() => {
    loadRapports();
  }, []);

  const loadRapports = async () => {
    try {
      setLoading(true);
      const rapportsData = await rapportService.getRapports();
      setRapports(rapportsData);
    } catch (error) {
      console.error("Erreur lors du chargement des rapports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un rapport via l'API
  const addRapport = async (rapportData) => {
    try {
      const newRapport = await rapportService.createRapport(rapportData);
      setRapports((prev) => [...prev, newRapport]);
      return newRapport;
    } catch (error) {
      console.error("Erreur lors de l'ajout du rapport:", error);
      throw error;
    }
  };

  // Supprimer un rapport via l'API
  const deleteRapport = async (id) => {
    try {
      await rapportService.deleteRapport(id);
      setRapports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du rapport:", error);
      throw error;
    }
  };

  return (
    <RapportContext.Provider
      value={{
        rapports,
        addRapport,
        deleteRapport,
        loading,
        refreshRapports: loadRapports,
      }}
    >
      {children}
    </RapportContext.Provider>
  );
};

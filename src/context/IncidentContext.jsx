import React, { createContext, useContext, useState, useEffect } from "react";
import { incidentService } from "../services/apiService";

const IncidentContext = createContext();

export const useIncident = () => useContext(IncidentContext);

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les incidents depuis l'API
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const incidentsData = await incidentService.getIncidents();
      console.log('📥 Incidents chargés:', incidentsData);
      setIncidents(incidentsData);
    } catch (error) {
      console.error('Erreur chargement incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un incident
  const addIncident = async (data) => {
    try {
      console.log('📤 Création incident avec données:', data);
      const newIncident = await incidentService.createIncident(data);
      console.log('✅ Incident créé:', newIncident);
      
      // IMPORTANT: Recharger les incidents depuis l'API
      await loadIncidents();
      
      return newIncident;
    } catch (error) {
      console.error('Erreur création incident:', error);
      throw error;
    }
  };

 
  // Marquer comme résolu
  const handleMarkResolved = async (id) => {
    try {
      await incidentService.markAsResolved(id);
      // Recharger depuis l'API
      await loadIncidents();
    } catch (error) {
      console.error('Erreur résolution incident:', error);
      throw error;
    }
  };

  // Supprimer
  const handleDelete = async (id) => {
    try {
      await incidentService.deleteIncident(id);
      // Recharger depuis l'API
      await loadIncidents();
    } catch (error) {
      console.error('Erreur suppression incident:', error);
      throw error;
    }
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        loading,
        addIncident,
        handleDelete,
        handleMarkResolved,
        refreshIncidents: loadIncidents
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
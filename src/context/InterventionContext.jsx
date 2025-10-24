import React, { createContext, useContext, useState, useEffect } from "react";
import { interventionService } from "../services/apiService";
import { useIncident } from "./IncidentContext";

const InterventionContext = createContext();
export const useInterventions = () => useContext(InterventionContext);

export const InterventionProvider = ({ children }) => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleMarkResolved } = useIncident();

  // Charger les interventions depuis l'API
  useEffect(() => {
    loadInterventions();
  }, []);

  const loadInterventions = async () => {
    try {
      setLoading(true);
      const interventionsData = await interventionService.getInterventions();
      console.log("📥 Interventions chargées:", interventionsData);
      setInterventions(interventionsData);
    } catch (error) {
      console.error("Erreur chargement interventions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dans votre contexte IncidentContext, ajoutez ce debug
  const loadIncidents = async () => {
    try {
      setLoading(true);
      const incidentsData = await incidentService.getIncidents();
      console.log("📥 STRUCTURE COMPLÈTE DES INCIDENTS:", incidentsData);

      if (incidentsData.length > 0) {
        console.log("📥 PREMIER INCIDENT DÉTAILLÉ:", incidentsData[0]);
        console.log("📥 CLIENT DU PREMIER INCIDENT:", incidentsData[0].client);
        console.log(
          "📥 PRODUIT DU PREMIER INCIDENT:",
          incidentsData[0].produit
        );
      }

      setIncidents(incidentsData);
    } catch (error) {
      console.error("Erreur chargement incidents:", error);
    } finally {
      setLoading(false);
    }
  };
  // Ajouter une intervention
  const addIntervention = async (data) => {
    try {
      console.log("📤 Création intervention avec données:", data);
      const newIntervention = await interventionService.createIntervention(
        data
      );
      console.log("✅ Intervention créée:", newIntervention);

      // Recharger depuis l'API
      await loadInterventions();

      return newIntervention;
    } catch (error) {
      console.error("Erreur création intervention:", error);
      throw error;
    }
  };

  // Démarrer une intervention
  const startIntervention = async (id) => {
    try {
      await interventionService.startIntervention(id);

      // Mettre à jour localement
      setInterventions((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                statut: "En cours",
                startedAt: new Date().toISOString(),
                date_demarre: new Date().toISOString().split("T")[0],
              }
            : i
        )
      );

      // Recharger depuis l'API pour être sûr
      await loadInterventions();
    } catch (error) {
      console.error("Erreur démarrage intervention:", error);
      throw error;
    }
  };

  // Terminer intervention
  const finishIntervention = async (id) => {
    try {
      await interventionService.finishIntervention(id);

      // Mettre à jour localement
      setInterventions((prev) =>
        prev.map((i) => {
          if (i.id === id) {
            // Résoudre l'incident si existe
            if (i.incidentId) {
              handleMarkResolved(Number(i.incidentId));
            }
            return {
              ...i,
              statut: "Terminé",
              endedAt: new Date().toISOString(),
            };
          }
          return i;
        })
      );

      // Recharger depuis l'API
      await loadInterventions();
    } catch (error) {
      console.error("Erreur fin intervention:", error);
      throw error;
    }
  };

  // Supprimer intervention
  const deleteIntervention = async (id) => {
    try {
      await interventionService.deleteIntervention(id);

      // Recharger depuis l'API
      await loadInterventions();
    } catch (error) {
      console.error("Erreur suppression intervention:", error);
      throw error;
    }
  };

  return (
    <InterventionContext.Provider
      value={{
        interventions,
        loading,
        addIntervention,
        startIntervention,
        finishIntervention,
        deleteIntervention,
        refreshInterventions: loadInterventions,
      }}
    >
      {children}
    </InterventionContext.Provider>
  );
};

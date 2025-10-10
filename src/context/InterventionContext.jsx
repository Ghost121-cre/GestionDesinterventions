// src/context/InterventionContext.jsx
import React, { createContext, useContext, useState } from "react";
import { useIncident } from "./IncidentContext";

const InterventionContext = createContext();
export const useInterventions = () => useContext(InterventionContext);

export const InterventionProvider = ({ children }) => {
  const [interventions, setInterventions] = useState([]);
  const { handleMarkResolved } = useIncident();

  // Générer un ID séquentiel formaté sur 3 chiffres
  const generateSequentialId = () => {
    if (interventions.length === 0) {
      return "001";
    }
    
    // Trouver le plus grand ID existant
    const maxId = Math.max(...interventions.map(i => {
      // Convertir l'ID en nombre (supprimer les zéros initiaux)
      return parseInt(i.id.toString(), 10);
    }));
    
    // Incrémenter et formater sur 3 chiffres
    const nextId = maxId + 1;
    return nextId.toString().padStart(3, '0');
  };

  // Ajouter une intervention
  const addIntervention = (data) => {
    const id = generateSequentialId();
    const newIntervention = { 
      id, 
      ...data, 
      statut: "En attente",
      date_demarre: null,
      startedAt: null,
      endedAt: null
    };
    
    setInterventions((prev) => [...prev, newIntervention]);
    console.log("Intervention ajoutée:", newIntervention);
  };

  // Démarrer une intervention
  const startIntervention = (id) => {
    setInterventions((prev) =>
      prev.map((i) =>
        i.id === id ? { 
          ...i, 
          statut: "En cours", 
          startedAt: new Date().toISOString(),
          date_demarre: new Date().toISOString().split('T')[0]
        } : i
      )
    );
  };

  // Terminer intervention
  const finishIntervention = (id) => {
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
            endedAt: new Date().toISOString() 
          };
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
import { authHeader } from './authHeader';

const API_URL = 'http://localhost:5275/api';

const handleResponse = async (response) => {
  console.log('📡 Statut HTTP:', response.status);
  console.log('📡 URL:', response.url);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('❌ Réponse erreur brute:', errorText);
    
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.title || `Erreur ${response.status}`;
      console.log('📋 Détails erreur JSON:', errorData);
    } catch {
      errorMessage = errorText || `Erreur ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    console.log('✅ Requête réussie (204 No Content)');
    return { success: true, id: parseInt(response.url.split('/').pop()) };
  }

  try {
    const result = await response.json();
    console.log('✅ Réponse succès:', result);
    return result;
  } catch (error) {
    console.log('⚠️ Réponse vide ou non-JSON');
    return { success: true };
  }
};

// Service dédié aux rapports
export const rapportService = {
  getRapports: async () => {
    try {
      const response = await fetch(`${API_URL}/rapports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      throw error;
    }
  },

  getRapport: async (id) => {
    try {
      const response = await fetch(`${API_URL}/rapports/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération du rapport ${id}:`, error);
      throw error;
    }
  },

  createRapport: async (rapportData) => {
  try {
    console.log('📤 Création rapport avec données:', rapportData);
    
    // Maintenant on envoie directement le tableau d'intervenants
    const rapportToCreate = {
      InterventionId: rapportData.interventionId,
      DateRapport: rapportData.dateRapport || new Date().toISOString(),
      Client: rapportData.client,
      Intervenants: rapportData.intervenant || [], // ← Tableau directement
      TypeIntervention: rapportData.typeIntervention,
      Description: rapportData.description,
      Observations: rapportData.observation || "",
      TravauxEffectues: rapportData.travauxEffectues || "",
      HeureDebut: rapportData.heureDebut || "",
      HeureFin: rapportData.heureFin || ""
    };

    console.log('✅ Rapport DTO à créer:', rapportToCreate);
    
    const response = await fetch(`${API_URL}/rapports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(rapportToCreate),
    });
    
    const result = await handleResponse(response);
    console.log('🎉 Rapport créé avec succès:', result);
    
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la création du rapport:", error);
    throw error;
  }
},

  updateRapport: async (id, rapportData) => {
    try {
      // Même transformation pour la modification
      const intervenantsString = Array.isArray(rapportData.intervenant) 
        ? rapportData.intervenant.join(', ') 
        : rapportData.intervenant || '';
      
      const rapportToUpdate = {
        ...rapportData,
        Intervenant: intervenantsString
      };
      
      const response = await fetch(`${API_URL}/rapports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(rapportToUpdate),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur modification rapport ${id}:`, error);
      throw error;
    }
  },

  deleteRapport: async (id) => {
    try {
      const response = await fetch(`${API_URL}/rapports/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`❌ Erreur suppression rapport ${id}:`, error);
      throw error;
    }
  }
};
import { authHeader } from './authHeader';

const API_URL = 'https://localhost:7134/api';

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

// Services pour la gestion des utilisateurs
export const userService = {
  getUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/utilisateurs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      console.log('📤 Création utilisateur avec données:', userData);
      const userToCreate = {
        ...userData, 
      };

      console.log('✅ Utilisateur à créer:', userToCreate);
      
      const response = await fetch(`${API_URL}/utilisateurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(userToCreate),
      });
      
      const result = await handleResponse(response);
      
      console.log('🎉 Utilisateur créé avec mot de passe en clair');
      
      return result;
      
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  },

   updateUser: async (id, userData) => {
    try {
      const response = await fetch(`${API_URL}/utilisateurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(userData),
      });

      console.log('🔄 DEBUG updateUser - Statut réponse:', response.status);
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur détaillée modification utilisateur ${id}:`, error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await fetch(`${API_URL}/utilisateurs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      throw error;
    }
  },

  toggleUserStatus: async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "actif" ? "inactif" : "actif";
      
      const response = await fetch(`${API_URL}/utilisateurs/${id}/statut`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify({ statut: newStatus }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur lors du changement de statut de l'utilisateur ${id}:`, error);
      throw error;
    }
  },
};

// Services pour la gestion des clients
export const clientService = {
  getClients: async () => {
    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  createClient: async (userClient) => {
    console.log('Création clients avec données:', userClient);
    try {
      const clientToCreate = {
        ...userClient, 
      };

      console.log('✅ clients à créer:', clientToCreate);
      
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(clientToCreate),
      });
      
      const result = await handleResponse(response);
      
      console.log('client créé avec mot de passe en clair');
      
      return result;
      
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'client:", error);
      throw error;
    }
  },

   updateClient: async (id, clientData) => {
    try {
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(clientData),
      });

      console.log('DEBUG updateUser - Statut réponse:', response.status);
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur détaillée modification client ${id}:`, error);
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de l'client ${id}:`, error);
      throw error;
    }
  },
};

// Services pour la gestion des produits
export const produitService = {
  getProduits: async () => {
    try {
      const response = await fetch(`${API_URL}/produits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  createProduit: async (userProduit) => {
    console.log('Création produit avec données:', userProduit);
    try {
      const produitToCreate = {
        ...userProduit, 
      };

      console.log('✅ produit à créer:', produitToCreate);
      
      const response = await fetch(`${API_URL}/produits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(produitToCreate),
      });
      
      const result = await handleResponse(response);
      
      console.log('produit créé avec mot de passe en clair');
      
      return result;
      
    } catch (error) {
      console.error("❌ Erreur lors de la création d'un produit:", error);
      throw error;
    }
  },

   updateProduit: async (id, produitData) => {
    try {
      const response = await fetch(`${API_URL}/produits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(produitData),
      });

      console.log('DEBUG updateUser - Statut réponse:', response.status);
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur détaillée modification produit ${id}:`, error);
      throw error;
    }
  },

  deleteProduit: async (id) => {
    try {
      const response = await fetch(`${API_URL}/produits/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du produit ${id}:`, error);
      throw error;
    }
  },
};

// Services pour la gestion des incidents
export const incidentService = {
  getIncidents: async () => {
    try {
      const response = await fetch(`${API_URL}/incidents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des incidents:', error);
      throw error;
    }
  },

  createIncident: async (incidentData) => {
    try {
      console.log('📤 Création incident avec données:', incidentData);
      
      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(incidentData),
      });
      
      const result = await handleResponse(response);
      console.log('🎉 Incident créé avec succès');
      
      return result;
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'incident:", error);
      throw error;
    }
  },

  updateIncident: async (id, incidentData) => {
    try {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(incidentData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur modification incident ${id}:`, error);
      throw error;
    }
  },

  uploadImage: async (incidentId, imageFile) => {
    try {
      console.log('📸 Upload image pour incident:', incidentId);
      
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch(`${API_URL}/incidents/${incidentId}/images`, {
        method: 'POST',
        headers: {
          ...authHeader()
        },
        body: formData
      });

      console.log('📸 Statut réponse upload:', response.status);
      console.log('📸 URL appelée:', `${API_URL}/incidents/${incidentId}/images`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Réponse erreur upload:', errorText);
        throw new Error(`Erreur upload: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Upload réussi:', result);
      return result;
      
    } catch (error) {
      console.error(`❌ Erreur upload image incident ${incidentId}:`, error);
      throw error;
    }
  }, 

  deleteIncident: async (id) => {
    try {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`❌ Erreur suppression incident ${id}:`, error);
      throw error;
    }
  },

  markAsResolved: async (id) => {
    try {
      const response = await fetch(`${API_URL}/incidents/${id}/resoudre`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur résolution incident ${id}:`, error);
      throw error;
    }
  }
};

// Services pour la gestion des interventions
export const interventionService = {
  getInterventions: async () => {
    try {
      const response = await fetch(`${API_URL}/interventions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des interventions:', error);
      throw error;
    }
  },

  createIntervention: async (interventionData) => {
    try {
      console.log('📤 Création intervention avec données:', interventionData);
      
      const response = await fetch(`${API_URL}/interventions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(interventionData),
      });
      
      const result = await handleResponse(response);
      console.log('🎉 Intervention créée avec succès');
      
      return result;
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'intervention:", error);
      throw error;
    }
  },

  updateIntervention: async (id, interventionData) => {
    try {
      const response = await fetch(`${API_URL}/interventions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(interventionData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur modification intervention ${id}:`, error);
      throw error;
    }
  },

  uploadImage: async (interventionId, imageFile) => {
    try {
      console.log('📸 Upload image pour intervention:', interventionId);
      
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch(`${API_URL}/interventions/${interventionId}/images`, {
        method: 'POST',
        headers: {
          ...authHeader()
        },
        body: formData
      });

      console.log('📸 Statut réponse upload:', response.status);
      console.log('📸 URL appelée:', `${API_URL}/interventions/${interventionId}/images`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Réponse erreur upload:', errorText);
        throw new Error(`Erreur upload: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Upload réussi:', result);
      return result;
      
    } catch (error) {
      console.error(`❌ Erreur upload image intervention ${interventionId}:`, error);
      throw error;
    }
  },

  deleteIntervention: async (id) => {
    try {
      const response = await fetch(`${API_URL}/interventions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`❌ Erreur suppression intervention ${id}:`, error);
      throw error;
    }
  },

  startIntervention: async (id) => {
    try {
      const response = await fetch(`${API_URL}/interventions/${id}/demarrer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur démarrage intervention ${id}:`, error);
      throw error;
    }
  },

  finishIntervention: async (id) => {
    try {
      const response = await fetch(`${API_URL}/interventions/${id}/terminer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`❌ Erreur fin intervention ${id}:`, error);
      throw error;
    }
  },
};

// Services pour les données générales
export const dataService = {
  getClients: async () => {
    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  getProduits: async () => {
    try {
      const response = await fetch(`${API_URL}/produits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  getTechniciens: async () => {
    try {
      // Si vous avez un endpoint pour les techniciens
      const response = await fetch(`${API_URL}/utilisateurs/techniciens`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des techniciens:', error);
      // Retourner une liste par défaut si l'endpoint n'existe pas
      return ["Nacro", "Youssouf", "Issouf"];
    }
  }
};
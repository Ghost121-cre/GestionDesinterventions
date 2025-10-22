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
// Helper pour les headers d'authentification
export const authHeader = () => {
  // Récupérer le token depuis le localStorage ou un state de contexte
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  
  return {};
};
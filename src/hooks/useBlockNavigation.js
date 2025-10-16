import { useEffect } from 'react';

export const useBlockNavigation = (shouldBlock = true) => {
  useEffect(() => {
    if (!shouldBlock) return;

    // Empêcher la navigation en arrière
    const handlePopState = (event) => {
      window.history.pushState(null, '', window.location.href);
    };

    // Bloquer le beforeunload
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    // Ajouter un état à l'historique
    window.history.pushState(null, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock]);
};
import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔐 Tentative de connexion avec:", { email, password });

      const response = await fetch("http://localhost:5275/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          MotDePasseHash: password,
        }),
      });

      console.log("📡 Statut HTTP:", response.status);

      if (!response.ok) {
        let errorMessage = "Email ou mot de passe incorrect";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.log("❌ Erreur API:", errorData);
        } catch {
          // Si la réponse n'est pas du JSON
        }

        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log("✅ Données utilisateur reçues:", userData);

      if (!userData) {
        throw new Error("Aucune donnée utilisateur reçue");
      }

      const formattedUser = {
        id: userData.id,
        prenom: userData.prenom,
        nom: userData.nom,
        email: userData.email,
        telephone: userData.telephone || "",
        role: userData.role || "Utilisateur",
        statut: userData.statut || "actif",
        dateCreation: userData.dateCreation,
        token: userData.token || "token-temporaire",
        premiereConnexion: userData.premiereConnexion ?? true,
        bio: userData.bio ?? "",
        pays: userData.pays ?? "",
        ville: userData.ville ?? "",
        avatar: userData.avatar ?? "",
      };

      console.log(
        "👤 Utilisateur formaté avec nouveaux champs:",
        formattedUser
      );
      setUser(formattedUser);
      return formattedUser;
    } catch (error) {
      console.error("💥 Erreur connexion:", error);
      const message = error.message || "Erreur de connexion";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("rememberedUser");
  };

  // 🔹 Mise à jour du profil
  const updateUser = async (newData) => {
    if (!user) throw new Error("Aucun utilisateur connecté");

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5275/api/utilisateurs/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedUser = await response.json();
      setUser((prev) => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      const message = error.message || "Erreur lors de la mise à jour";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Changer le mot de passe (pour première connexion et profil)
  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error("Aucun utilisateur connecté");

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5275/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors du changement de mot de passe"
        );
      }

      const result = await response.json();

      // Mettre à jour l'utilisateur pour indiquer que la première connexion est terminée
      if (user.premiereConnexion) {
        setUser((prev) => ({
          ...prev,
          premiereConnexion: false,
        }));
      }

      return result;
    } catch (error) {
      const message =
        error.message || "Erreur lors du changement de mot de passe";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Changer le mot de passe pour première connexion (sans ancien mot de passe)
  const changePasswordFirstLogin = async (newPassword) => {
    if (!user) throw new Error("Aucun utilisateur connecté");

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5275/api/auth/change-password-first-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            newPassword,
          }),
        }
      );

      console.log("📡 Statut changement mot de passe:", response.status);

      if (!response.ok) {
        let errorMessage = "Erreur lors du changement de mot de passe";

        try {
          // Essayer de parser la réponse JSON
          const errorText = await response.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (parseError) {
          console.log("❌ Réponse non-JSON:", parseError);
          // Si ce n'est pas du JSON, utiliser le statut HTTP
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // Pour les réponses vides (204 No Content)
      if (response.status === 204) {
        console.log("✅ Mot de passe changé (204 No Content)");

        // Mettre à jour l'utilisateur
        setUser((prev) => ({
          ...prev,
          premiereConnexion: false,
        }));

        return { success: true };
      }

      // Pour les réponses avec contenu
      try {
        const result = await response.json();
        console.log("✅ Mot de passe changé:", result);

        setUser((prev) => ({
          ...prev,
          premiereConnexion: false,
        }));

        return result;
      } catch (jsonError) {
        console.log("⚠️ Réponse vide après changement mot de passe");

        setUser((prev) => ({
          ...prev,
          premiereConnexion: false,
        }));

        return { success: true };
      }
    } catch (error) {
      console.error("💥 Erreur changement mot de passe:", error);
      const message =
        error.message || "Erreur lors du changement de mot de passe";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // État
    user,
    loading,
    error,

    // Méthodes
    login,
    logout,
    updateUser,
    changePassword,
    changePasswordFirstLogin,

    // Helpers
    isAuthenticated: !!user,
    isFirstLogin: user?.premiereConnexion === true,

    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};

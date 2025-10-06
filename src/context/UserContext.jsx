import React, { createContext, useState, useEffect } from "react";
import userAvatar from "../assets/images/user.png";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const demoUser = {
    prenom: "Touré",
    nom: "Issouf",
    email: "demo@activ.com",
    password: "demo123",
    avatar: userAvatar,
    role: "Utilisateur",
    status: "online", // petit rond vert sur la navbar
  };

  // 🔹 Charger depuis localStorage au démarrage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 🔹 Sauvegarder automatiquement à chaque mise à jour
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 🔹 Connexion avec le compte démo
  const loginDemo = () => setUser(demoUser);

  // 🔹 Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // 🔹 Mise à jour du profil (photo, nom, etc.)
  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginDemo, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

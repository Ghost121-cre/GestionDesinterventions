import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/RegisterPage.css";
import Activ from "../assets/images/activ.png";
import userAvatar from "../assets/images/user.png";
import { UserContext } from "../context/UserContext";

function RegisterPage() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    bio: "",
    pays: "",
    ville: "",
    codePostal: "",
    avatar: userAvatar,
    role: "Utilisateur"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData); // Met à jour le contexte
    navigate("/profil"); // Redirection après inscription
  };

  return (
    <div className="register-container">
      <div className="logo-bar">
        <img src={Activ} alt="Logo" className="logo-image" />
        <span className="logo-text">Gestion des interventions</span>
      </div>

      <div className="register-box">
        <div className="left">
          <h2>Inscrivez-vous</h2>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Prénom</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <input type="text" name="bio" value={formData.bio} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Pays</label>
              <input type="text" name="pays" value={formData.pays} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Ville</label>
              <input type="text" name="ville" value={formData.ville} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Code Postal</label>
              <input type="text" name="codePostal" value={formData.codePostal} onChange={handleChange} />
            </div>

            <button type="submit" className="submit-btn">S'inscrire</button>

            <p className="login-link">
              Vous avez déjà un compte? <Link to="/login">Connectez-vous</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

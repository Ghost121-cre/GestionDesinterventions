import React from "react";
import { Link } from "react-router-dom";
import Login from "../assets/images/Login.jpg";
import Activ from "../assets/images/activ.png";
import "../assets/css/LoginPage.css";

function LoginPage() {
  return (
    <div className="login-container">
      {/* Logo en haut qui prend toute la largeur */}
      <div className="logo-bar">
        <img src={Activ} alt="Logo" className="logo-image" />
        <span className="logo-text">Gestion des interventions</span>
      </div>

      {/* Contenu principal */}
      <div className="login-box">
        {/* Formulaire à gauche */}
        <div className="left">
          <h2>Connexion</h2>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="adresseMail">Email:</label>
              <input
                type="email"
                id="adresseMail"
                placeholder="Entrez votre email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de Passe:</label>
              <input
                type="password"
                id="password"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
            <button type="submit">Login</button>

            {/* Bouton Google */}
            <button type="button" className="google-btn">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="google-icon"
              />
              Connectez-vous avec Google
            </button>

            <div className="register-link">
              <Link to="/register">
                Vous n'avez pas de compte? Inscrivez-vous
              </Link>
            </div>
          </form>
        </div>

        {/* Image à droite */}
        <div className="right">
          <img src={Login} alt="Login" className="login-image" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

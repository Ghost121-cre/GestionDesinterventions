import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../assets/images/Login.jpg";
import Activ from "../assets/images/activ.png";
import "../assets/css/LoginPage.css";
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const { setUser, loginDemo } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 Simulation d’un compte utilisateur local
  const validUser = {
    nom: "Touré",
    prenom: "Issouf",
    email: "demo@activ.com",
    password: "demo123",
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    role: "Utilisateur",
    status: "online",
  };

  // ✅ Connexion avec Google
  const handleGoogleLogin = () => {
    const googleUser = {
      nom: "Touré",
      prenom: "Issouf",
      email: "toureissouf390@gmail.com",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      role: "Utilisateur",
      status: "online",
    };
    setUser(googleUser);
    navigate("/profil");
  };

  // ✅ Connexion par email / mot de passe
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === validUser.email && password === validUser.password) {
      setUser(validUser);
      navigate("/profil");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-bar">
        <img src={Activ} alt="Logo" className="logo-image" />
        <span className="logo-text">Gestion des interventions</span>
      </div>

      <div className="login-box">
        <div className="left">
          <h2>Connexion</h2>

          {/* Bouton Google */}
          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="google-icon"
            />
            Se connecter avec Google
          </button>

          <p className="or-text">ou connectez-vous avec votre email</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email :</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
              />
            </div>

            <div className="form-group">
              <label>Mot de passe :</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit">Connexion</button>
          </form>

          <div className="forgot-password">
            <Link to="/reset-password">Mot de passe oublié ?</Link>
          </div>

          <div className="register-link">
            <Link to="/register">Vous n'avez pas de compte ? Inscrivez-vous</Link>
          </div>
        </div>

        <div className="right">
          <img src={Login} alt="Login" className="login-image" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { 
  cilEnvelopeOpen, 
  cilLockLocked, 
  cilUser, 
  cilShieldAlt,
  cilCheckCircle,
  cilWarning
} from "@coreui/icons";
import Login from "../assets/images/Login.jpg";
import Activ from "../assets/images/activ.png";
import styles from "../assets/css/LoginPage.module.css";
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const { setUser, user } = useContext(UserContext); // Ajoutez user ici
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate("/accueil", { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    
    // IMPORTANT: Utiliser replace: true pour supprimer la page de login de l'historique
    navigate("/accueil", { replace: true });
  };

  const handleDemoLogin = (demoAccount) => {
    handleLoginSuccess(demoAccount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = demoAccounts.find(
      user => user.email === formData.email && user.password === formData.password
    );

    if (foundUser) {
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          email: formData.email,
          remember: true
        }));
      }
      handleLoginSuccess(foundUser);
    } else {
      setError("Email ou mot de passe incorrect");
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      nom: "Touré",
      prenom: "Issouf",
      email: "toureissouf390@gmail.com",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      role: "Utilisateur",
      status: "online",
    };
    handleLoginSuccess(googleUser);
  };

  return (
    <div className={styles.loginPage}>
      {/* Header avec logo */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={Activ} alt="Activ Management" className={styles.logo} />
          <div className={styles.logoText}>
            <h1>Activ Management</h1>
            <p>Gestion des interventions techniques</p>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className={styles.container}>
        <div className={styles.loginCard}>
          {/* Section gauche - Formulaire */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <h2>Connexion à votre compte</h2>
              <p>Accédez à votre espace de gestion d'interventions</p>
            </div>

            {/* Bouton Google */}
            <button 
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              type="button"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className={styles.googleIcon}
              />
              Continuer avec Google
            </button>

            <div className={styles.separator}>
              <span>Ou avec email et mot de passe</span>
            </div>

            {/* Formulaire de connexion */}
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <CIcon icon={cilEnvelopeOpen} className={styles.inputIcon} />
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <CIcon icon={cilLockLocked} className={styles.inputIcon} />
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Votre mot de passe"
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Se souvenir de moi</span>
                </label>
                <Link to="/reset-password" className={styles.forgotLink}>
                  Mot de passe oublié ?
                </Link>
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  <CIcon icon={cilWarning} className={styles.errorIcon} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilShieldAlt} className={styles.btnIcon} />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            <div className={styles.registerSection}>
              <p>Nouveau sur Activ Management ?</p>
              <Link to="/register" className={styles.registerLink}>
                Créer un compte
              </Link>
            </div>
          </div>

          {/* Section droite - Illustration */}
          <div className={styles.illustrationSection}>
            <div className={styles.illustrationContent}>
              <img src={Login} alt="Gestion d'interventions" className={styles.illustration} />
              <div className={styles.illustrationText}>
                <h3>Gérez vos interventions efficacement</h3>
                <p>
                  Suivez, planifiez et optimisez toutes vos interventions techniques 
                  depuis une interface unique et intuitive.
                </p>
                <ul className={styles.featuresList}>
                  <li>
                    <CIcon icon={cilCheckCircle} className={styles.featureIcon} />
                    Suivi en temps réel
                  </li>
                  <li>
                    <CIcon icon={cilCheckCircle} className={styles.featureIcon} />
                    Rapports automatisés
                  </li>
                  <li>
                    <CIcon icon={cilCheckCircle} className={styles.featureIcon} />
                    Gestion des équipes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2024 Activ Management. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
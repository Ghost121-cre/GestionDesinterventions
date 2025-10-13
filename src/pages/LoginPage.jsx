import React, { useContext, useState } from "react";
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
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Comptes de démonstration
  const demoAccounts = [
    {
      nom: "Touré",
      prenom: "Issouf",
      email: "demo@activ.com",
      password: "demo123",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      role: "Administrateur",
      status: "online",
    },
    {
      nom: "Messou",
      prenom: "Ghost",
      email: "technicien@activ.com",
      password: "tech123",
      avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      role: "Technicien",
      status: "online",
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError("");
  };

  const handleDemoLogin = (demoAccount) => {
    setUser(demoAccount);
    navigate("/accueil");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = demoAccounts.find(
      user => user.email === formData.email && user.password === formData.password
    );

    if (foundUser) {
      setUser(foundUser);
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          email: formData.email,
          remember: true
        }));
      }
      navigate("/accueil");
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
    setUser(googleUser);
    navigate("/accueil");
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

            {/* Comptes de démonstration */}
            <div className={styles.demoAccounts}>
              <h3>Comptes de démonstration</h3>
              <div className={styles.demoGrid}>
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    className={styles.demoBtn}
                    onClick={() => handleDemoLogin(account)}
                  >
                    <CIcon icon={cilUser} className={styles.demoIcon} />
                    <div className={styles.demoInfo}>
                      <strong>{account.prenom} {account.nom}</strong>
                      <span>{account.role}</span>
                    </div>
                    <CIcon icon={cilCheckCircle} className={styles.chevronIcon} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.separator}>
              <span>Ou connectez-vous avec</span>
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
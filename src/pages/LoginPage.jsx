import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import {
  cilEnvelopeOpen,
  cilLockLocked,
  cilShieldAlt,
  cilCheckCircle,
  cilWarning,
} from "@coreui/icons";
import Login from "../assets/images/Login.jpg";
import Activ from "../assets/images/activ.png";
import styles from "../assets/css/LoginPage.module.css";
import { useUser } from "../context/UserContext";
import FirstLoginModal from "../pages/FirstLoginModal.jsx";

function LoginPage() {
  const {
    user,
    login,
    changePasswordFirstLogin,
    loading,
    error: contextError,
  } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

  // Rediriger si l'utilisateur est déjà connecté et n'a pas de première connexion
  useEffect(() => {
    if (user && !user.premiereConnexion) {
      navigate("/accueil", { replace: true });
    } else if (user && user.premiereConnexion) {
      setShowFirstLoginModal(true);
    }
  }, [user, navigate]);

  // Synchroniser les erreurs du contexte
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            email: formData.email,
            remember: true,
          })
        );
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
    }
  };

  const handleFirstLoginPasswordChange = async (newPassword) => {
    try {
      await changePasswordFirstLogin(newPassword);
      setShowFirstLoginModal(false);
      navigate("/accueil", { replace: true });
    } catch (error) {
      throw error;
    }
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                    disabled={loading}
                  />
                  <span className={styles.checkboxText}>
                    Se souvenir de moi
                  </span>
                </label>
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
                disabled={loading}
              >
                {loading ? (
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
          </div>

          {/* Section droite - Illustration */}
          <div className={styles.illustrationSection}>
            <div className={styles.illustrationContent}>
              <img
                src={Login}
                alt="Gestion d'interventions"
                className={styles.illustration}
              />
              <div className={styles.illustrationText}>
                <h3>Gérez vos interventions efficacement</h3>
                <p>
                  Suivez, planifiez et optimisez toutes vos interventions
                  techniques depuis une interface unique et intuitive.
                </p>
                <ul className={styles.featuresList}>
                  <li>
                    <CIcon
                      icon={cilCheckCircle}
                      className={styles.featureIcon}
                    />
                    Suivi en temps réel
                  </li>
                  <li>
                    <CIcon
                      icon={cilCheckCircle}
                      className={styles.featureIcon}
                    />
                    Rapports automatisés
                  </li>
                  <li>
                    <CIcon
                      icon={cilCheckCircle}
                      className={styles.featureIcon}
                    />
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

      {/* Modal pour première connexion */}
      <FirstLoginModal
        isOpen={showFirstLoginModal}
        onClose={() => setShowFirstLoginModal(false)}
        onChangePassword={handleFirstLoginPasswordChange}
      />
    </div>
  );
}

export default LoginPage;

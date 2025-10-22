import React, { useState } from "react";
import CIcon from "@coreui/icons-react";
import { 
  cilLockLocked, 
  cilLowVision, 
  cilShieldAlt,
  cilWarning,
  cilX
} from "@coreui/icons";
import styles from "../assets/css/FirstLoginModal.module.css";

function FirstLoginModal({ isOpen, onClose, onChangePassword }) {
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onChangePassword(passwordData.newPassword);
      // Ne pas fermer le modal ici - la fermeture sera gérée par le parent
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      setErrors({ submit: error.message || "Erreur lors du changement de mot de passe" });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleClose = () => {
    setPasswordData({
      newPassword: "",
      confirmPassword: ""
    });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <CIcon icon={cilShieldAlt} className={styles.modalIcon} />
            <h2 className={styles.modalTitle}>Première connexion</h2>
          </div>
          <button 
            type="button" 
            className={styles.closeButton}
            onClick={handleClose}
            disabled={loading}
          >
            <CIcon icon={cilX} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            Pour des raisons de sécurité, vous devez modifier votre mot de passe avant de continuer.
          </p>

          <form onSubmit={handleSubmit} className={styles.passwordForm}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Nouveau mot de passe *
              </label>
              <div className={styles.passwordInputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  placeholder="Entrez votre nouveau mot de passe"
                  className={`${styles.formInput} ${errors.newPassword ? styles.inputError : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  <CIcon icon={showPassword ? cilLowVision : cilLowVision} />
                </button>
              </div>
              {errors.newPassword && (
                <span className={styles.errorText}>{errors.newPassword}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Confirmer le mot de passe *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre nouveau mot de passe"
                className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            {errors.submit && (
              <div className={styles.submitError}>
                <CIcon icon={cilWarning} className={styles.errorIcon} />
                {errors.submit}
              </div>
            )}

            <div className={styles.passwordHelp}>
              <CIcon icon={cilLockLocked} className={styles.helpIcon} />
              Le mot de passe doit contenir au moins 6 caractères
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleClose}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Modification...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilShieldAlt} className={styles.btnIcon} />
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FirstLoginModal;
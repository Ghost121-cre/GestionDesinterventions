import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { 
  cilUser, 
  cilEnvelopeOpen, 
  cilLockLocked, 
  cilPhone, 
  cilMap,
  cilDescription,
  cilCheckCircle,
  cilWarning,
  cilShieldAlt,
  cilLowVision,
  cilBriefcase
} from "@coreui/icons";
import Activ from "../assets/images/activ.png";
import userAvatar from "../assets/images/user.png";
import styles from "../assets/css/RegisterPage.module.css";
import { UserContext } from "../context/UserContext";

function RegisterPage() {
  const { register, loading, error: contextError } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "+225 05 96 31 02 62",
    password: "",
    confirmPassword: "",
    bio: "",
    pays: "Côte d'Ivoire",
    ville: "Abidjan",
    codePostal: "",
    avatar: userAvatar,
    role: "Utilisateur"
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }
    
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate("/profil");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Informations personnelles" },
    { number: 2, title: "Profil complémentaire" }
  ];

  return (
    <div className={styles.registerPage}>
      {/* Header avec logo */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src={Activ} alt="Activ Management" className={styles.logo} />
          <div className={styles.logoText}>
            <h1>Activ Management</h1>
            <p>Rejoignez notre plateforme</p>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.registerCard}>
          {/* Étapes de progression */}
          <div className={styles.progressSection}>
            <div className={styles.steps}>
              {steps.map((step) => (
                <div 
                  key={step.number} 
                  className={`${styles.step} ${currentStep >= step.number ? styles.active : ''}`}
                >
                  <div className={styles.stepNumber}>{step.number}</div>
                  <span className={styles.stepTitle}>{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          <form className={styles.registerForm} onSubmit={handleSubmit}>
            {/* Étape 1 - Informations personnelles */}
            {currentStep === 1 && (
              <div className={styles.formStep}>
                <div className={styles.stepHeader}>
                  <h2>Informations personnelles</h2>
                  <p>Créez votre compte pour commencer à utiliser la plateforme</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilUser} className={styles.inputIcon} />
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.prenom ? styles.error : ''}`}
                      placeholder="Votre prénom"
                      disabled={isLoading}
                    />
                    {errors.prenom && <span className={styles.errorText}>{errors.prenom}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilUser} className={styles.inputIcon} />
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.nom ? styles.error : ''}`}
                      placeholder="Votre nom"
                      disabled={isLoading}
                    />
                    {errors.nom && <span className={styles.errorText}>{errors.nom}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilEnvelopeOpen} className={styles.inputIcon} />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
                      placeholder="votre@email.com"
                      disabled={isLoading}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilPhone} className={styles.inputIcon} />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="+225 00 00 00 00"
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilLockLocked} className={styles.inputIcon} />
                      Mot de passe *
                    </label>
                    <div className={styles.passwordInputContainer}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${styles.formInput} ${styles.passwordInput} ${errors.password ? styles.error : ''}`}
                        placeholder="Au moins 6 caractères"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={togglePasswordVisibility}
                        disabled={isLoading}
                      >
                        <CIcon icon={showPassword ? cilLowVision : cilLowVision} className={styles.passwordToggleIcon} />
                      </button>
                    </div>
                    {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilLockLocked} className={styles.inputIcon} />
                      Confirmer le mot de passe *
                    </label>
                    <div className={styles.passwordInputContainer}>
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`${styles.formInput} ${styles.passwordInput} ${errors.confirmPassword ? styles.error : ''}`}
                        placeholder="Retapez votre mot de passe"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={toggleConfirmPasswordVisibility}
                        disabled={isLoading}
                      >
                        <CIcon icon={showConfirmPassword ? cilLowVision : cilLowVision} className={styles.passwordToggleIcon} />
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className={styles.errorText}>{errors.confirmPassword}</span>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <div className={styles.errorMessage}>
                    <CIcon icon={cilWarning} className={styles.errorIcon} />
                    {errors.submit}
                  </div>
                )}

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.nextBtn}
                    onClick={nextStep}
                    disabled={isLoading}
                  >
                    Suivant
                    <CIcon icon={cilCheckCircle} className={styles.btnIcon} />
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2 - Profil complémentaire */}
            {currentStep === 2 && (
              <div className={styles.formStep}>
                <div className={styles.stepHeader}>
                  <h2>Profil complémentaire</h2>
                  <p>Complétez votre profil (ces informations sont facultatives)</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilBriefcase} className={styles.inputIcon} />
                      Rôle *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={styles.formSelect}
                      disabled={isLoading}
                    >
                      <option value="Gestionnaire">Gestionnaire</option>
                      <option value="Technicien">Technicien</option>
                      <option value="Administrateur">Administrateur</option>
                      <option value="Chef Technique">Chef Technique</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilDescription} className={styles.inputIcon} />
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className={styles.formTextarea}
                      placeholder="Décrivez-vous en quelques mots..."
                      rows="3"
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilMap} className={styles.inputIcon} />
                      Pays
                    </label>
                    <select
                      name="pays"
                      value={formData.pays}
                      onChange={handleChange}
                      className={styles.formSelect}
                      disabled={isLoading}
                    >
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="Sénégal">Sénégal</option>
                      <option value="Mali">Mali</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilMap} className={styles.inputIcon} />
                      Ville
                    </label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="Votre ville"
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <CIcon icon={cilMap} className={styles.inputIcon} />
                      Code Postal
                    </label>
                    <input
                      type="text"
                      name="codePostal"
                      value={formData.codePostal}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="00225"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {errors.submit && (
                  <div className={styles.errorMessage}>
                    <CIcon icon={cilWarning} className={styles.errorIcon} />
                    {errors.submit}
                  </div>
                )}

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.backBtn}
                    onClick={prevStep}
                    disabled={isLoading}
                  >
                    Retour
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className={styles.spinner}></div>
                        Création du compte...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilShieldAlt} className={styles.btnIcon} />
                        Créer mon compte
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className={styles.loginSection}>
            <p>Déjà inscrit ?</p>
            <Link to="/login" className={styles.loginLink}>
              Se connecter
            </Link>
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

export default RegisterPage;
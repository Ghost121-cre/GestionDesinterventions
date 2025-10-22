import React, { useContext, useState, useEffect } from "react";
import styles from "../assets/css/Profil.module.css";
import { UserContext } from "../context/UserContext";
import { useInterventions } from "../context/InterventionContext";
import { useIncident } from "../context/IncidentContext";
import CIcon from "@coreui/icons-react";
import { 
  cilPencil, 
  cilCheck, 
  cilX, 
  cilUser,
  cilEnvelopeOpen,
  cilPhone,
  cilMap,
  cilGlobeAlt,
  cilBriefcase,
  cilDescription,
  cilClock,
  cilCheckCircle,
  cilWarning,
  cilChartLine,
  cilLockLocked
} from "@coreui/icons";

function Profil() {
  const { user, setUser } = useContext(UserContext);
  const { interventions } = useInterventions();
  const { incidents } = useIncident();
  
  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [formData, setFormData] = useState(user || {
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    bio: "",
    role: "",
    pays: "",
    ville: "",
    avatar: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Calcul des statistiques réelles
  const getRealStats = () => {
    const userInterventions = interventions.filter(i => i.technicien === `${formData.prenom} ${formData.nom}`.trim());
    const interventionsTerminees = userInterventions.filter(i => i.statut === "Terminé").length;
    const interventionsEnCours = userInterventions.filter(i => i.statut === "En cours").length;
    const userIncidents = incidents.filter(inc => inc.statut === "non résolu").length;
    
    // Calcul du taux de satisfaction (simulé pour l'exemple)
    const satisfaction = userInterventions.length > 0 
      ? Math.min(100, Math.floor((interventionsTerminees / userInterventions.length) * 100) + 20)
      : 0;

    return {
      totalInterventions: userInterventions.length,
      interventionsTerminees,
      interventionsEnCours,
      incidentsNonResolus: userIncidents,
      satisfaction
    };
  };

  const stats = getRealStats();

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <CIcon icon={cilUser} size="3xl" className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Utilisateur non connecté</h2>
          <p className={styles.emptyText}>Veuillez vous connecter pour accéder à votre profil</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ 
        ...prev, 
        avatar: e.target.result 
      }));
    };
    reader.readAsDataURL(file);
  }
};

  const validatePassword = () => {
    const errors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Le mot de passe actuel est requis";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Le nouveau mot de passe est requis";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Veuillez confirmer le nouveau mot de passe";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordUpdate = async () => {
  if (validatePassword()) {
    try {
      console.log('🔑 Changement mot de passe...');

      const response = await fetch(`https://localhost:7134/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      console.log('📡 Statut changement mot de passe:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du changement de mot de passe');
      }

      const result = await response.json();
      console.log('✅ Mot de passe changé:', result);
      
      // Réinitialiser les champs
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordEditMode(false);
      
      alert("Mot de passe modifié avec succès !");
      
    } catch (error) {
      console.error('💥 Erreur changement mot de passe:', error);
      setPasswordErrors({ submit: error.message });
    }
  }
};

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordEditMode(false);
  };

const handleSave = async () => {
  try {
    const profileData = {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      bio: formData.bio || "",
      pays: formData.pays || "",
      ville: formData.ville || "",
      avatar: formData.avatar || ""
    };

    console.log('📤 Mise à jour profil:', profileData);

    const response = await fetch(`https://localhost:7134/api/utilisateurs/update-profile/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    console.log('📡 Statut réponse:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Erreur détaillée:', errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const updatedUser = await response.json();
    console.log('✅ Profil mis à jour:', updatedUser);
    
    // Mettre à jour l'utilisateur dans le contexte
    setUser(prev => ({ ...prev, ...updatedUser }));
    setEditMode(false);
    
    alert("Profil modifié avec succès !");
    
  } catch (error) {
    console.error('💥 Erreur sauvegarde profil:', error);
    alert(`Erreur: ${error.message}`);
  }
};
  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  const getFieldIcon = (field) => {
    switch(field) {
      case 'prenom':
      case 'nom':
        return cilUser;
      case 'email':
        return cilEnvelopeOpen;
      case 'telephone':
        return cilPhone;
      case 'bio':
        return cilDescription;
      case 'role':
        return cilBriefcase;
      case 'pays':
        return cilGlobeAlt;
      case 'ville':
      default:
        return cilUser;
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      prenom: "Prénom",
      nom: "Nom",
      email: "Email",
      telephone: "Téléphone",
      bio: "Biographie",
      role: "Rôle",
      pays: "Pays",
      ville: "Ville",
    };
    return labels[field] || field;
  };

  const getFieldType = (field) => {
    if (field === 'email') return 'email';
    if (field === 'telephone') return 'tel';
    return 'text';
  };

  // Interventions récentes
  const recentInterventions = interventions
    .filter(i => i.technicien === `${formData.prenom} ${formData.nom}`.trim())
    .sort((a, b) => new Date(b.datetime || b.createdAt) - new Date(a.datetime || a.createdAt))
    .slice(0, 5);

  return (
    <div className={styles.fullScreenContainer}>
      {/* Carte principale en plein écran */}
      <div className={styles.fullScreenCard}>
        {/* Header du profil */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
  <img 
    src={formData.avatar} 
    alt="Avatar" 
    className={styles.avatar}
    onError={(e) => {
    e.target.src = ""; 
    }}
  />
  {editMode && (
    <label className={styles.avatarEdit}>
      <CIcon icon={cilPencil} className={styles.avatarEditIcon} />
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className={styles.avatarInput}
      />
    </label>
  )}
</div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>
                {formData.prenom} {formData.nom}
              </h2>
              <div className={styles.profileRole}>
                <CIcon icon={cilBriefcase} className={styles.roleIcon} />
                {formData.role}
              </div>
              {formData.bio && (
                <p className={styles.profileBio}>{formData.bio}</p>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            {editMode ? (
              <div className={styles.editActions}>
                <button className={styles.saveBtn} onClick={handleSave}>
                  <CIcon icon={cilCheck} className={styles.btnIcon} />
                  Sauvegarder
                </button>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  <CIcon icon={cilX} className={styles.btnIcon} />
                  Annuler
                </button>
              </div>
            ) : (
              <div className={styles.editActions}>
                <button 
                  className={styles.editBtn}
                  onClick={() => setEditMode(true)}
                >
                  <CIcon icon={cilPencil} className={styles.btnIcon} />
                  Modifier le profil
                </button>
                <button 
                  className={styles.editBtn}
                  onClick={() => setPasswordEditMode(true)}
                >
                  <CIcon icon={cilLockLocked} className={styles.btnIcon} />
                  Modifier le mot de passe
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* Colonne gauche - Informations personnelles */}
          <div className={styles.leftColumn}>
            {/* Informations personnelles */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <CIcon icon={cilUser} className={styles.sectionIcon} />
                Informations personnelles
              </h3>
              <div className={styles.fieldsGrid}>
                {['prenom', 'nom', 'email', 'telephone', 'bio'].map(field => (
                  <div key={field} className={styles.field}>
                    <label className={styles.fieldLabel}>
                      <CIcon icon={getFieldIcon(field)} className={styles.fieldIcon} />
                      {getFieldLabel(field)}
                    </label>
                    {editMode ? (
                      field === 'bio' ? (
                        <textarea
                          name={field}
                          value={formData[field] || ''}
                          onChange={handleChange}
                          placeholder={`Entrez votre ${getFieldLabel(field).toLowerCase()}`}
                          className={styles.textarea}
                          rows={3}
                        />
                      ) : (
                        <input
                          type={getFieldType(field)}
                          name={field}
                          value={formData[field] || ''}
                          onChange={handleChange}
                          placeholder={`Entrez votre ${getFieldLabel(field).toLowerCase()}`}
                          className={styles.input}
                        />
                      )
                    ) : (
                      <div className={styles.fieldValue}>
                        {formData[field] || (
                          <span className={styles.placeholder}>Non renseigné</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Adresse */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <CIcon icon={cilMap} className={styles.sectionIcon} />
                Adresse
              </h3>
              <div className={styles.fieldsGrid}>
                {['pays', 'ville'].map(field => (
                  <div key={field} className={styles.field}>
                    <label className={styles.fieldLabel}>
                      <CIcon icon={getFieldIcon(field)} className={styles.fieldIcon} />
                      {getFieldLabel(field)}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name={field}
                        value={formData[field] || ''}
                        onChange={handleChange}
                        placeholder={`Entrez votre ${getFieldLabel(field).toLowerCase()}`}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.fieldValue}>
                        {formData[field] || (
                          <span className={styles.placeholder}>Non renseigné</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modification du mot de passe */}
            {passwordEditMode && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <CIcon icon={cilLockLocked} className={styles.sectionIcon} />
                  Modifier le mot de passe
                </h3>
                <div className={styles.fieldsGrid}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      <CIcon icon={cilLockLocked} className={styles.fieldIcon} />
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Entrez votre mot de passe actuel"
                      className={`${styles.input} ${passwordErrors.currentPassword ? styles.inputError : ''}`}
                    />
                    {passwordErrors.currentPassword && (
                      <span className={styles.errorText}>{passwordErrors.currentPassword}</span>
                    )}
                  </div>
                  
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      <CIcon icon={cilLockLocked} className={styles.fieldIcon} />
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Entrez votre nouveau mot de passe"
                      className={`${styles.input} ${passwordErrors.newPassword ? styles.inputError : ''}`}
                    />
                    {passwordErrors.newPassword && (
                      <span className={styles.errorText}>{passwordErrors.newPassword}</span>
                    )}
                  </div>
                  
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      <CIcon icon={cilLockLocked} className={styles.fieldIcon} />
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirmez votre nouveau mot de passe"
                      className={`${styles.input} ${passwordErrors.confirmPassword ? styles.inputError : ''}`}
                    />
                    {passwordErrors.confirmPassword && (
                      <span className={styles.errorText}>{passwordErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.passwordActions}>
                  <button className={styles.saveBtn} onClick={handlePasswordUpdate}>
                    <CIcon icon={cilCheck} className={styles.btnIcon} />
                    Mettre à jour le mot de passe
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancelPassword}>
                    <CIcon icon={cilX} className={styles.btnIcon} />
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - Statistiques et activité */}
          <div className={styles.rightColumn}>
            {/* Statistiques */}
            <div className={styles.statsSection}>
              <h3 className={styles.sectionTitle}>
                <CIcon icon={cilChartLine} className={styles.sectionIcon} />
                Mes Statistiques
              </h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statIconWrapper}>
                    <CIcon icon={cilBriefcase} className={styles.statIcon} />
                  </div>
                  <div className={styles.statValue}>{stats.totalInterventions}</div>
                  <div className={styles.statLabel}>Interventions totales</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statIconWrapper}>
                    <CIcon icon={cilCheckCircle} className={styles.statIcon} />
                  </div>
                  <div className={styles.statValue}>{stats.interventionsTerminees}</div>
                  <div className={styles.statLabel}>Terminées</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statIconWrapper}>
                    <CIcon icon={cilClock} className={styles.statIcon} />
                  </div>
                  <div className={styles.statValue}>{stats.interventionsEnCours}</div>
                  <div className={styles.statLabel}>En cours</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statIconWrapper}>
                    <CIcon icon={cilWarning} className={styles.statIcon} />
                  </div>
                  <div className={styles.statValue}>{stats.incidentsNonResolus}</div>
                  <div className={styles.statLabel}>Incidents actifs</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statIconWrapper}>
                    <CIcon icon={cilChartLine} className={styles.statIcon} />
                  </div>
                  <div className={styles.statValue}>{stats.satisfaction}%</div>
                  <div className={styles.statLabel}>Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Interventions récentes */}
            <div className={styles.activitySection}>
              <h3 className={styles.sectionTitle}>
                <CIcon icon={cilClock} className={styles.sectionIcon} />
                Interventions Récentes
              </h3>
              <div className={styles.activityList}>
                {recentInterventions.length > 0 ? (
                  recentInterventions.map((intervention, index) => (
                    <div key={intervention.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <CIcon icon={
                          intervention.statut === "Terminé" ? cilCheckCircle :
                          intervention.statut === "En cours" ? cilClock : cilWarning
                        } />
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityTitle}>
                          {intervention.client} - {intervention.produit}
                        </div>
                        <div className={styles.activityDetails}>
                          <span className={`${styles.statusBadge} ${
                            intervention.statut === "Terminé" ? styles.statusCompleted :
                            intervention.statut === "En cours" ? styles.statusInProgress : styles.statusPending
                          }`}>
                            {intervention.statut}
                          </span>
                          <span className={styles.activityDate}>
                            {intervention.datetime ? new Date(intervention.datetime).toLocaleDateString('fr-FR') : 'Date non définie'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noActivity}>
                    <CIcon icon={cilBriefcase} className={styles.noActivityIcon} />
                    <p>Aucune intervention récente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;
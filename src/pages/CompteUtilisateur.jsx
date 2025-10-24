import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";
import { userService } from "../services/apiService";
import CIcon from "@coreui/icons-react";
import { 
  cilPencil, 
  cilTrash, 
  cilPlus,
  cilPhone,
  cilSearch,
  cilFilter,
  cilUser,
  cilEnvelopeOpen,
  cilShieldAlt,
  cilWarning,
  cilCheckCircle,
  cilBan,
  cilLockLocked,
  cilLowVision,
} from "@coreui/icons";
import styles from "../assets/css/CompteUtilisateur.module.css";

function CompteUtilisateur() {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({ 
    id: "", 
    prenom: "", 
    nom: "", 
    email: "", 
    role: "",
    telephone: "",
    statut: "",
    motDePasse: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState("");

  const roles = ["Administrateur", "Gestionnaire", "Technicien", "Utilisateur"];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getUsers();
      const usersWithVisiblePasswords = usersData.map(user => ({
        ...user,
        motDePasseVisible: user.motDePasseHash || "password123"
      }));
      setUsers(usersWithVisiblePasswords);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatut = !filterStatut || user.statut === filterStatut;
    return matchesSearch && matchesRole && matchesStatut;
  });

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const toggleFormPasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSave = async () => {
    if (!newUser.prenom.trim() || !newUser.nom.trim() || !newUser.email.trim() || !newUser.telephone.trim()) {
      toast.error("Le prénom, le nom, l'email et le téléphone sont requis");
      return;
    }

    if (!newUser.motDePasse.trim()) {
      toast.error("Le mot de passe est obligatoire");
      return;
    }

    if (!isValidEmail(newUser.email)) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    if (!isValidPhone(newUser.telephone)) {
      toast.error("Veuillez entrer un numéro de téléphone valide");
      return;
    }

    if (!isValidPassword(newUser.motDePasse)) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

     setSaving(true);
  try {
    const userData = {
      prenom: newUser.prenom.trim(),
      nom: newUser.nom.trim(),
      email: newUser.email.trim(),
      telephone: newUser.telephone.trim(),
      role: newUser.role,
      statut: newUser.statut,
      motDePasseHash: newUser.motDePasse,
      premiereConnexion: true,
      bio: "",
      pays: "",
      ville: "",
      avatar: ""
    };

    console.log('📤 Données envoyées:', userData);

    if (isEditing) {

       const userDataWithId = {
        id: parseInt(newUser.id),
        ...userData
      };
      
      console.log('Données pour modification:', userDataWithId);
      const result = await userService.updateUser(newUser.id, userDataWithId);
      
      setUsers(users.map(u => 
        u.id === newUser.id ? { 
          ...u, // Garder les anciennes propriétés
          ...userData, // Appliquer les nouvelles
          motDePasseVisible: newUser.motDePasse // Garder le mot de passe visible
        } : u
      ));
      
      toast.success("✅ Utilisateur modifié avec succès");
      addNotification(`Utilisateur modifié : ${userData.prenom} ${userData.nom}`);
    } else {
      const result = await userService.createUser(userData);
      toast.success("✅ Utilisateur ajouté avec succès");
    }

    resetForm();
    hideOffcanvas();
  } catch (error) {
    console.error('💥 Erreur:', error);
    toast.error(error.message);
  } finally {
    setSaving(false);
  }
};

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9+\-\s()]{10,}$/.test(phone);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleDelete = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.prenom} ${user.nom}" ?`)) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        toast.info("🗑️ Utilisateur supprimé");
        addNotification(`Utilisateur supprimé : ${user.prenom} ${user.nom}`);
      } catch (error) {
        toast.error(error.message || "Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    try {
      const updatedUser = await userService.toggleUserStatus(id, user.statut);
      setUsers(users.map(u => u.id === id ? { ...updatedUser, motDePasseVisible: user.motDePasseVisible } : u));
      
      const newStatus = updatedUser.statut;
      toast.info(`Statut modifié : ${user.prenom} ${user.nom} est maintenant ${newStatus}`);
    } catch (error) {
      toast.error(error.message || "Erreur lors du changement de statut");
    }
  };

  const handleEdit = (user) => {
    setNewUser({
      id: user.id,
      prenom: user.prenom || "",
      nom: user.nom || "",
      email: user.email || "",
      role: user.role || "",
      telephone: user.telephone || "",
      statut: user.statut || "",
      motDePasse: user.motDePasseVisible || ""
    });
    setIsEditing(true);
    setShowPassword(false);
    showOffcanvas();
  };

  const handleAddClick = () => {
    resetForm();
    setIsEditing(false);
    setShowPassword(false);
    showOffcanvas();
  };

  const resetForm = () => {
    setNewUser({ 
      id: "", 
      prenom: "", 
      nom: "", 
      email: "", 
      role: "Utilisateur",
      telephone: "",
      statut: "actif",
      motDePasse: ""
    });
  };

  const showOffcanvas = () => {
    const offcanvasElement = document.getElementById('offcanvasUser');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  const hideOffcanvas = () => {
    const offcanvasElement = document.getElementById('offcanvasUser');
    if (offcanvasElement) {
      const offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) offcanvas.hide();
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      "Administrateur": styles.roleAdmin,
      "Gestionnaire": styles.roleGestionnaire,
      "Technicien": styles.roleTechnicien,
      "Utilisateur": styles.roleUtilisateur
    };
    return roleMap[role] || styles.roleUtilisateur;
  };

  const getStatutBadgeClass = (statut) => {
    return statut === "actif" ? styles.statutActif : styles.statutInactif;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getFullName = (user) => {
    return `${user.prenom || ''} ${user.nom || ''}`.trim();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Mot de passe copié dans le presse-papier");
    }).catch(() => {
      toast.error("Erreur lors de la copie");
    });
  };

  // Fonction pour formater le numéro de téléphone
  // const formatPhoneNumber = (value) => {
    // Supprimer tous les espaces existants
    // const cleaned = value.replace(/\D/g, '');
    // Ajouter un espace tous les 2 chiffres
  //   const formatted = cleaned.replace(/(\d{2})(?=\d)/g, '$1 ');
  //   return formatted.trim();
  // }

  // const hanfleChangePhone = (e) => {
  //   const input = e.target.value;
     // Supprimer tout sauf les chiffres pour le stockage
    // const cleaned = input.replace(/\D/g, '');
      // Formater l'affichage
  //  
  
  const handlePhoneChange = (e) => {
  const input = e.target.value;
  
  // Garder seulement chiffres et espaces
  const cleanValue = input.replace(/[^\d\s]/g, '');
  
  // Enlever les espaces pour compter les chiffres
  const digitsOnly = cleanValue.replace(/\s/g, '');
  
  // Limiter à 10 chiffres et reformater
  const limitedDigits = digitsOnly.substring(0, 10);
  const formatted = formatPhoneNumber(limitedDigits);
  
  setNewUser({ ...newUser, telephone: formatted });
};

// Fonction formatPhoneNumber modifiée pour mieux gérer la saisie
const formatPhoneNumber = (value) => {
  const cleanValue = value.replace(/\s/g, '');
  let formatted = '';
  
  for (let i = 0; i < cleanValue.length; i++) {
    if (i > 0 && i % 2 === 0) {
      formatted += ' ';
    }
    formatted += cleanValue[i];
  }
  
  return formatted;
};

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbWrapper}>
          <nav aria-label="breadcrumb">
            <ol className={styles.breadcrumb}>
              <li className={styles.breadcrumbItem} onClick={() => navigate("/parametres")}>
                Paramètres
              </li>
              <li className={styles.breadcrumbSeparator}>/</li>
              <li className={styles.breadcrumbItemActive}>Comptes Utilisateurs</li>
            </ol>
          </nav>
        </div>

        {/* En-tête avec statistiques */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <CIcon icon={cilUser} className={styles.titleIcon} />
              Gestion des Utilisateurs
            </h1>
            <p className={styles.subtitle}>
              {users.length} utilisateur(s) dans le système
              {loading && " (Chargement...)"}
            </p>
          </div>
          <button className={styles.addButton} onClick={handleAddClick} disabled={loading}>
            <CIcon icon={cilPlus} className={styles.btnIcon} />
            Nouvel Utilisateur
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className={styles.filtersSection}>
          <div className={styles.searchBox}>
            <CIcon icon={cilSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              disabled={loading}
            />
          </div>
          <div className={styles.filterGroup}>
            <CIcon icon={cilFilter} className={styles.filterIcon} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={styles.filterSelect}
              disabled={loading}
            >
              <option value="">Tous les rôles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <CIcon icon={cilFilter} className={styles.filterIcon} />
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className={styles.filterSelect}
              disabled={loading}
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              Liste des Utilisateurs ({filteredUsers.length})
              {loading && " - Chargement..."}
            </div>
          </div>
          
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>Chargement des utilisateurs...</div>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Contact</th>
                  <th>Rôle</th>
                  <th>Mot de passe</th>
                  <th>Statut</th>
                  <th>Création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyState}>
                      <CIcon icon={cilWarning} className={styles.emptyIcon} />
                      <div className={styles.emptyText}>
                        {users.length === 0 
                          ? "Aucun utilisateur n'a été créé pour le moment" 
                          : "Aucun utilisateur ne correspond à votre recherche"
                        }
                      </div>
                      {users.length === 0 && (
                        <button className={styles.emptyAction} onClick={handleAddClick}>
                          <CIcon icon={cilPlus} />
                          Créer le premier utilisateur
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={styles.tableRow}>
                      <td className={styles.userCell}>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            <CIcon icon={cilUser} className={styles.avatarIcon} />
                          </div>
                          <div>
                            <strong>{getFullName(user)}</strong>
                            <div className={styles.userEmail}>
                              <CIcon icon={cilEnvelopeOpen} className={styles.infoIcon} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.contactCell}>
                        <div className={styles.contactInfo}>
                          <CIcon icon={cilPhone} className={styles.infoIcon} />
                          {user.telephone || "Non renseigné"}
                        </div>
                      </td>
                      <td className={styles.roleCell}>
                        <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                          <CIcon icon={cilShieldAlt} className={styles.roleIcon} />
                          {user.role}
                        </span>
                      </td>
                      <td className={styles.passwordCell}>
                        <div className={styles.passwordField}>
                          <CIcon icon={cilLockLocked} className={styles.passwordIcon} />
                          <span className={styles.passwordText}>
                            {visiblePasswords[user.id] ? user.motDePasseVisible : "********"}
                          </span>
                          <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => togglePasswordVisibility(user.id)}
                            title={visiblePasswords[user.id] ? "Masquer" : "Afficher"}
                          >
                            <CIcon icon={cilLowVision} />
                          </button>
                          {visiblePasswords[user.id] && user.motDePasseVisible && (
                            <button
                              type="button"
                              className={styles.copyButton}
                              onClick={() => copyToClipboard(user.motDePasseVisible)}
                              title="Copier le mot de passe"
                            >
                              <CIcon icon={cilCheckCircle} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className={styles.statutCell}>
                        <span className={`${styles.statutBadge} ${getStatutBadgeClass(user.statut)}`}>
                          {user.statut === "actif" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {user.dateCreation ? formatDate(user.dateCreation) : "-"}
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEdit(user)}
                            title="Modifier"
                            disabled={saving}
                          >
                            <CIcon icon={cilPencil} />
                          </button>
                          <button
                            className={user.statut === "actif" ? styles.disableBtn : styles.enableBtn}
                            onClick={() => handleToggleStatus(user.id)}
                            title={user.statut === "actif" ? "Désactiver" : "Activer"}
                            disabled={saving}
                          >
                            <CIcon icon={user.statut === "actif" ? cilBan : cilCheckCircle} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(user.id)}
                            title="Supprimer"
                            disabled={saving}
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Offcanvas pour ajouter/modifier */}
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasUser">
          <div className={styles.offcanvasHeader}>
            <h5 className={styles.offcanvasTitle}>
              {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              disabled={saving}
            ></button>
          </div>
          <div className="offcanvas-body">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-3">
                <label className={styles.formLabel}>Prénom </label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={newUser.prenom}
                  onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Nom </label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={newUser.nom}
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Email </label>
                <input
                  type="email"
                  className={styles.formControl}
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Téléphone </label>
                <input
                  type="tel"
                  className={styles.formControl}
                  value={newUser.telephone}
                  onChange={handlePhoneChange}
                  required
                  disabled={saving}
                  maxLength="14"
                />
              </div>

              <div className="mb-3">
                <label className={styles.formLabel}>Mot de passe </label>
                <div className={styles.passwordInputGroup}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.formControl}
                    value={newUser.motDePasse}
                    onChange={(e) => setNewUser({ ...newUser, motDePasse: e.target.value })}
                    placeholder={isEditing ? "Nouveau mot de passe" : "Mot de passe"}
                    required
                    disabled={saving}
                    minLength="6"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleBtn}
                    onClick={toggleFormPasswordVisibility}
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <CIcon icon={cilLowVision} />
                  </button>
                </div>
                <div className={styles.passwordHelp}>
                  Le mot de passe doit contenir au moins 6 caractères
                </div>
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Rôle</label>
                <select
                  className={styles.formControl}
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  disabled={saving}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className={styles.formLabel}>Statut</label>
                <select
                  className={styles.formControl}
                  value={newUser.statut}
                  onChange={(e) => setNewUser({ ...newUser, statut: e.target.value })}
                  disabled={saving}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  data-bs-dismiss="offcanvas"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? "Enregistrement..." : (isEditing ? "Mettre à jour" : "Créer l'utilisateur")}
                </button>
              </div>
            </form>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default CompteUtilisateur;
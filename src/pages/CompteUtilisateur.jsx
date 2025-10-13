import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";
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
  cilBan
} from "@coreui/icons";
import styles from "../assets/css/CompteUtilisateur.module.css";

function CompteUtilisateur() {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    id: "", 
    nom: "", 
    email: "", 
    role: "Utilisateur",
    telephone: "",
    statut: "actif",
    dateCreation: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatut, setFilterStatut] = useState("");

  const roles = ["Administrateur", "Gestionnaire", "Technicien", "Utilisateur"];

  useEffect(() => {
    const saved = localStorage.getItem("utilisateurs");
    if (saved) setUsers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("utilisateurs", JSON.stringify(users));
  }, [users]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.departement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatut = !filterStatut || user.statut === filterStatut;
    return matchesSearch && matchesRole && matchesStatut;
  });

  const handleSave = () => {
    if (!newUser.nom.trim() || !newUser.email.trim()) {
      toast.error("Le nom et l'email sont requis");
      return;
    }

    if (!isValidEmail(newUser.email)) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    if (isEditing) {
      setUsers(users.map(u => (u.id === newUser.id ? newUser : u)));
      toast.success("✅ Utilisateur modifié avec succès");
      addNotification(`Utilisateur modifié : ${newUser.nom}`);
    } else {
      const userAvecId = { 
        ...newUser, 
        id: Date.now(),
        dateCreation: new Date().toISOString(),
        password: "password123" // À remplacer par un système de hash en production
      };
      setUsers([...users, userAvecId]);
      toast.success("✅ Utilisateur ajouté avec succès");
      addNotification(`Nouvel utilisateur ajouté : ${newUser.nom}`);
    }

    resetForm();
    hideOffcanvas();
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleDelete = (id) => {
    const user = users.find(u => u.id === id);
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ?`)) {
      setUsers(users.filter(u => u.id !== id));
      toast.info("🗑️ Utilisateur supprimé");
      addNotification(`Utilisateur supprimé : ${user.nom}`);
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, statut: u.statut === "actif" ? "inactif" : "actif" } : u
    ));
    const user = users.find(u => u.id === id);
    const newStatus = user.statut === "actif" ? "inactif" : "actif";
    toast.info(`Statut modifié : ${user.nom} est maintenant ${newStatus}`);
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setIsEditing(true);
    showOffcanvas();
  };

  const handleAddClick = () => {
    resetForm();
    setIsEditing(false);
    showOffcanvas();
  };

  const resetForm = () => {
    setNewUser({ 
      id: "", 
      nom: "", 
      email: "", 
      role: "Utilisateur",
      telephone: "",
      statut: "actif",
      dateCreation: ""
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
            </p>
          </div>
          <button className={styles.addButton} onClick={handleAddClick}>
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
            />
          </div>
          <div className={styles.filterGroup}>
            <CIcon icon={cilFilter} className={styles.filterIcon} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={styles.filterSelect}
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
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Contact</th>
                <th>Rôle</th>
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
                          <strong>{user.nom}</strong>
                          <div className={styles.userEmail}>
                            <CIcon icon={cilEnvelopeOpen} className={styles.infoIcon} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.contactCell}>
                      {user.telephone && (
                        <div className={styles.contactInfo}>
                          <CIcon icon={cilPhone} className={styles.infoIcon} />
                          {user.telephone}
                        </div>
                      )}
                    </td>
                    <td className={styles.roleCell}>
                      <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                        <CIcon icon={cilShieldAlt} className={styles.roleIcon} />
                        {user.role}
                      </span>
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
                        >
                          <CIcon icon={cilPencil} />
                        </button>
                        <button
                          className={user.statut === "actif" ? styles.disableBtn : styles.enableBtn}
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.statut === "actif" ? "Désactiver" : "Activer"}
                        >
                          <CIcon icon={user.statut === "actif" ? cilBan : cilCheckCircle} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(user.id)}
                          title="Supprimer"
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
            ></button>
          </div>
          <div className="offcanvas-body">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-3">
                <label className={styles.formLabel}>Nom complet *</label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={newUser.nom}
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Email *</label>
                <input
                  type="email"
                  className={styles.formControl}
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Téléphone</label>
                <input
                  type="tel"
                  className={styles.formControl}
                  value={newUser.telephone}
                  onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Rôle</label>
                <select
                  className={styles.formControl}
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                >
                  {isEditing ? "Mettre à jour" : "Créer l'utilisateur"}
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
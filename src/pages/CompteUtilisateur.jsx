import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";
import styles from "../assets/css/CompteUtilisateur.module.css";

function CompteUtilisateur() {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: "", nom: "", email: "", role: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!newUser.nom || !newUser.email) {
      toast.error("Nom et Email requis");
      return;
    }

    if (isEditing) {
      setUsers(users.map(u => (u.id === newUser.id ? newUser : u)));
      toast.success("Utilisateur modifié");
      addNotification(`Utilisateur modifié : ${newUser.nom}`);
    } else {
      const createdUser = { ...newUser, id: Date.now() };
      setUsers([...users, createdUser]);
      toast.success("Utilisateur ajouté");
      addNotification(`Nouvel utilisateur ajouté : ${newUser.nom}`);
    }

    setNewUser({ id: "", nom: "", email: "", role: "" });
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    const deletedUser = users.find(u => u.id === id);
    setUsers(users.filter(u => u.id !== id));
    toast.info("Utilisateur supprimé");
    addNotification(`Utilisateur supprimé : ${deletedUser?.nom || "Inconnu"}`);
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setIsEditing(true);
    // Ouvrir l'offcanvas via Bootstrap JavaScript
    const offcanvasElement = document.getElementById('offcanvasUser');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  const handleAddClick = () => {
    setNewUser({ id: "", nom: "", email: "", role: "" });
    setIsEditing(false);
    // Ouvrir l'offcanvas via Bootstrap JavaScript
    const offcanvasElement = document.getElementById('offcanvasUser');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbWrapper}>
  <nav aria-label="breadcrumb">
    <ol className={styles.breadcrumb}>
      <li
        className={styles.breadcrumbItem}
        onClick={() => navigate("/parametres")}
      >
        Paramètres
      </li>
      <li className={styles.breadcrumbSeparator}>/</li>
      <li className={styles.breadcrumbItemActive}>Comptes Utilisateurs</li>
    </ol>
  </nav>
</div>
      
      <div className={styles.header}>
        <h3 className={styles.title}>Comptes Utilisateurs</h3>
        <button 
          className={`btn btn-primary ${styles.addButton}`}
          onClick={handleAddClick}
        >
          + Ajouter
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={`table table-striped ${styles.table}`}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyState}>
                  Aucun utilisateur
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nom}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <i 
                      className={`bi bi-pencil-square text-primary ${styles.actionIcon}`}
                      role="button" 
                      title="Modifier"
                      onClick={() => handleEdit(u)} 
                    />
                    <i 
                      className={`bi bi-trash-fill text-danger ${styles.actionIcon}`}
                      role="button" 
                      title="Supprimer"
                      onClick={() => handleDelete(u.id)} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasUser">
        <div className={styles.offcanvasHeader}>
          <h5>{isEditing ? "Modifier Utilisateur" : "Nouveau Utilisateur"}</h5>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input 
              type="text" 
              className={`form-control ${styles.formControl}`}
              value={newUser.nom} 
              onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })} 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className={`form-control ${styles.formControl}`}
              value={newUser.email} 
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rôle</label>
            <input 
              type="text" 
              className={`form-control ${styles.formControl}`}
              value={newUser.role} 
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} 
            />
          </div>
          <button 
            type="button" 
            className={styles.saveButton}
            data-bs-dismiss="offcanvas"
            onClick={handleSave}
          >
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CompteUtilisateur;
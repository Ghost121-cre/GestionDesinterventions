import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import styles from "../assets/css/Client.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Client() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ id: "", nom: "", adresse: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!newClient.nom || !newClient.email) {
      toast.error("Nom et Email requis");
      return;
    }

    if (isEditing) {
      setClients(clients.map(c => (c.id === newClient.id ? newClient : c)));
      toast.success("Client modifié");
    } else {
      setClients([...clients, { ...newClient, id: Date.now() }]);
      toast.success("Client ajouté");
    }

    setNewClient({ id: "", nom: "", adresse: "", email: "" });
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    setClients(clients.filter(c => c.id !== id));
    toast.info("Client supprimé");
  };

  const handleEdit = (client) => {
    setNewClient(client);
    setIsEditing(true);
    // Ouvrir l'offcanvas via Bootstrap JavaScript
    const offcanvasElement = document.getElementById('offcanvasClient');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  const handleAddClick = () => {
    setNewClient({ id: "", nom: "", adresse: "", email: "" });
    setIsEditing(false);
    // Ouvrir l'offcanvas via Bootstrap JavaScript
    const offcanvasElement = document.getElementById('offcanvasClient');
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
      <li className={styles.breadcrumbItemActive}>Clients</li>
    </ol>
  </nav>
</div>
      <div className={styles.header}>
        <h3 className={styles.title}>Clients</h3>
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
              <th>Adresse</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyState}>
                  Aucun client
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nom}</td>
                  <td>{c.adresse}</td>
                  <td>{c.email}</td>
                  <td>
                    <i 
                      className={`bi bi-pencil-square text-primary ${styles.actionIcon}`}
                      role="button" 
                      title="Modifier"
                      onClick={() => handleEdit(c)} 
                    />
                    <i 
                      className={`bi bi-trash-fill text-danger ${styles.actionIcon}`}
                      role="button" 
                      title="Supprimer"
                      onClick={() => handleDelete(c.id)} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasClient">
        <div className={styles.offcanvasHeader}>
          <h5>{isEditing ? "Modifier Client" : "Nouveau Client"}</h5>
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
              value={newClient.nom} 
              onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })} 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Adresse</label>
            <input 
              type="text" 
              className={`form-control ${styles.formControl}`}
              value={newClient.adresse} 
              onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })} 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className={`form-control ${styles.formControl}`}
              value={newClient.email} 
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} 
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

export default Client;
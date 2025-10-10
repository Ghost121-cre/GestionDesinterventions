import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilPlus } from "@coreui/icons";
import styles from "../assets/css/Produit.module.css";

function Produit() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [newProduit, setNewProduit] = useState({ id: "", nom: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("produits");
    if (saved) setProduits(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("produits", JSON.stringify(produits));
  }, [produits]);

  const handleSave = () => {
    if (!newProduit.nom) {
      toast.error("Le nom est requis");
      return;
    }

    if (isEditing) {
      setProduits(produits.map(p => (p.id === newProduit.id ? newProduit : p)));
      toast.success("Produit modifié");
    } else {
      setProduits([...produits, { ...newProduit, id: Date.now() }]);
      toast.success("Produit ajouté");
    }

    setNewProduit({ id: "", nom: "" });
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    setProduits(produits.filter(p => p.id !== id));
    toast.info("Produit supprimé");
  };

  const handleEdit = (produit) => {
    setNewProduit(produit);
    setIsEditing(true);
    // Ouvrir l'offcanvas via Bootstrap JavaScript
    const offcanvasElement = document.getElementById('offcanvasProduit');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  const handleAddClick = () => {
    setNewProduit({ id: "", nom: "" });
    setIsEditing(false);
    // Ouvrir l'offcanvas via Bootstrap JavaScript
    const offcanvasElement = document.getElementById('offcanvasProduit');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

          <div className={styles.breadcrumbWrapper}>
        <nav aria-label="breadcrumb">
          <ol className={styles.breadcrumbAuto}>
            <li
              className={styles.breadcrumbItemAuto}
              onClick={() => navigate("/parametres")}
         >
             Paramètres
           </li>
           <li className={`${styles.breadcrumbItemAuto} ${styles.breadcrumbItemActiveAuto}`}>
            Produits
          </li>
        </ol>
        </nav>
       </div>

        <div className={styles.header}>
          <h3 className={styles.title}>Produits</h3>
          <button
            className={styles.addButton}
            onClick={handleAddClick}
          >
            <CIcon icon={cilPlus} />
            Ajouter
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={`table ${styles.table}`}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {produits.length === 0 ? (
                <tr>
                  <td colSpan="3" className={styles.emptyState}>
                    Aucun produit
                  </td>
                </tr>
              ) : (
                produits.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nom}</td>
                    <td>
                      <CIcon
                        icon={cilPencil}
                        className={`text-primary ${styles.actionIcon}`}
                        role="button"
                        title="Modifier"
                        onClick={() => handleEdit(p)}
                      />
                      <CIcon
                        icon={cilTrash}
                        className={`text-danger ${styles.actionIcon}`}
                        role="button"
                        title="Supprimer"
                        onClick={() => handleDelete(p.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Offcanvas */}
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasProduit">
          <div className={styles.offcanvasHeader}>
            <h5>{isEditing ? "Modifier un produit" : "Nouveau produit"}</h5>
            <button 
              type="button" 
              className="btn-close" 
              data-bs-dismiss="offcanvas"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="mb-3">
              <label className="form-label">Nom du produit</label>
              <input
                type="text"
                className={`form-control ${styles.formControl}`}
                value={newProduit.nom}
                onChange={(e) => setNewProduit({ ...newProduit, nom: e.target.value })}
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
    </div>
  );
}

export default Produit;
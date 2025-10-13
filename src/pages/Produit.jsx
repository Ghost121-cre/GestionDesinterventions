import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { 
  cilPencil, 
  cilTrash, 
  cilPlus,
  cilSearch,
  cilFilter,
  cilInfo,
  cilWarning
} from "@coreui/icons";
import styles from "../assets/css/Produit.module.css";

function Produit() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [newProduit, setNewProduit] = useState({ 
    id: "", 
    nom: "", 
    description: "", 
    categorie: "",
    prix: "",
    statut: "actif"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("");

  // Catégories disponibles
  const categories = ["Logiciel", "Matériel", "Service", "Consulting", "Formation"];

  useEffect(() => {
    const saved = localStorage.getItem("produits");
    if (saved) setProduits(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("produits", JSON.stringify(produits));
  }, [produits]);

  // Produits filtrés
  const filteredProduits = produits.filter(produit => {
    const matchesSearch = produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie = !filterCategorie || produit.categorie === filterCategorie;
    return matchesSearch && matchesCategorie;
  });

  const handleSave = () => {
    if (!newProduit.nom.trim()) {
      toast.error("Le nom du produit est requis");
      return;
    }

    if (isEditing) {
      setProduits(produits.map(p => (p.id === newProduit.id ? newProduit : p)));
      toast.success("✅ Produit modifié avec succès");
    } else {
      const produitAvecId = { 
        ...newProduit, 
        id: Date.now(),
        dateCreation: new Date().toISOString()
      };
      setProduits([...produits, produitAvecId]);
      toast.success("✅ Produit ajouté avec succès");
    }

    resetForm();
    hideOffcanvas();
  };

  const handleDelete = (id) => {
    const produit = produits.find(p => p.id === id);
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${produit.nom}" ?`)) {
      setProduits(produits.filter(p => p.id !== id));
      toast.info("🗑️ Produit supprimé");
    }
  };

  const handleEdit = (produit) => {
    setNewProduit(produit);
    setIsEditing(true);
    showOffcanvas();
  };

  const handleAddClick = () => {
    resetForm();
    setIsEditing(false);
    showOffcanvas();
  };

  const resetForm = () => {
    setNewProduit({ 
      id: "", 
      nom: "", 
      description: "", 
      categorie: "",
      prix: "",
      statut: "actif"
    });
  };

  const showOffcanvas = () => {
    const offcanvasElement = document.getElementById('offcanvasProduit');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  const hideOffcanvas = () => {
    const offcanvasElement = document.getElementById('offcanvasProduit');
    if (offcanvasElement) {
      const offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) offcanvas.hide();
    }
  };

  const getStatutBadgeClass = (statut) => {
    return statut === "actif" ? styles.statutActif : styles.statutInactif;
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
              <li className={styles.breadcrumbItemActive}>Produits</li>
            </ol>
          </nav>
        </div>

        {/* En-tête avec statistiques */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <CIcon icon={cilInfo} className={styles.titleIcon} />
              Gestion des Produits
            </h1>
            <p className={styles.subtitle}>
              {produits.length} produit(s) dans votre catalogue
            </p>
          </div>
          <button className={styles.addButton} onClick={handleAddClick}>
            <CIcon icon={cilPlus} className={styles.btnIcon} />
            Nouveau Produit
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className={styles.filtersSection}>
          <div className={styles.searchBox}>
            <CIcon icon={cilSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <CIcon icon={cilFilter} className={styles.filterIcon} />
            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              Liste des Produits ({filteredProduits.length})
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProduits.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>
                    <CIcon icon={cilWarning} className={styles.emptyIcon} />
                    <div className={styles.emptyText}>
                      {produits.length === 0 
                        ? "Aucun produit n'a été créé pour le moment" 
                        : "Aucun produit ne correspond à votre recherche"
                      }
                    </div>
                    {produits.length === 0 && (
                      <button className={styles.emptyAction} onClick={handleAddClick}>
                        <CIcon icon={cilPlus} />
                        Créer le premier produit
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProduits.map((produit) => (
                  <tr key={produit.id} className={styles.tableRow}>
                    <td className={styles.idCell}>#{produit.id}</td>
                    <td className={styles.nomCell}>
                      <strong>{produit.nom}</strong>
                    </td>
                    <td className={styles.descCell}>
                      {produit.description || "Aucune description"}
                    </td>
                    <td className={styles.catCell}>
                      <span className={styles.categorieBadge}>
                        {produit.categorie || "Non catégorisé"}
                      </span>
                    </td>
                    <td className={styles.statutCell}>
                      <span className={`${styles.statutBadge} ${getStatutBadgeClass(produit.statut)}`}>
                        {produit.statut === "actif" ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(produit)}
                          title="Modifier"
                        >
                          <CIcon icon={cilPencil} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(produit.id)}
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
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasProduit">
          <div className={styles.offcanvasHeader}>
            <h5 className={styles.offcanvasTitle}>
              {isEditing ? "Modifier le produit" : "Nouveau produit"}
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
                <label className={styles.formLabel}>Nom du produit *</label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={newProduit.nom}
                  onChange={(e) => setNewProduit({ ...newProduit, nom: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formControl}
                  rows="3"
                  value={newProduit.description}
                  onChange={(e) => setNewProduit({ ...newProduit, description: e.target.value })}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Catégorie</label>
                <select
                  className={styles.formControl}
                  value={newProduit.categorie}
                  onChange={(e) => setNewProduit({ ...newProduit, categorie: e.target.value })}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className={styles.formLabel}>Statut</label>
                <select
                  className={styles.formControl}
                  value={newProduit.statut}
                  onChange={(e) => setNewProduit({ ...newProduit, statut: e.target.value })}
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
                  {isEditing ? "Mettre à jour" : "Créer le produit"}
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

export default Produit;
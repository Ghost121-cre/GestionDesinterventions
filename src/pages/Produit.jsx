import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { produitService } from "../services/apiService";
import {
  cilPencil,
  cilTrash,
  cilPlus,
  cilSearch,
  cilFilter,
  cilInfo,
  cilWarning,
} from "@coreui/icons";
import styles from "../assets/css/Produit.module.css";

function Produit() {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newProduit, setNewProduit] = useState({
    id: "",
    nom: "",
    description: "",
    categorie: "",
    statut: "actif",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("");

  // Catégories disponibles
  const categories = ["Logiciel", "Matériel", "Service"];

  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = async () => {
    try {
      setLoading(true);
      const produitsData = await produitService.getProduits();
      setProduits(produitsData);
    } catch (error) {
      toast.error("Erreur lors du chargement des produits");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Produits filtrés
  const filteredProduits = produits.filter((produit) => {
    const matchesSearch =
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (produit.description &&
        produit.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategorie =
      !filterCategorie || produit.categorie === filterCategorie;
    return matchesSearch && matchesCategorie;
  });

  const handleSave = async () => {
    if (!newProduit.nom.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    setSaving(true);
    try {
      const produitData = {
        nom: newProduit.nom.trim(),
        description: newProduit.description.trim(),
        categorie: newProduit.categorie,
        statut: newProduit.statut,
      };

      console.log("Données produit à sauvegarder:", produitData);

      if (isEditing) {
        const produitDataWithId = {
          id: parseInt(newProduit.id),
          ...produitData,
        };

        console.log("Données pour modification:", produitDataWithId);

        const result = await produitService.updateProduit(
          newProduit.id,
          produitDataWithId
        );
        setProduits(
          produits.map((produit) =>
            produit.id === newProduit.id
              ? {
                  ...produit,
                  ...produitData,
                }
              : produit
          )
        );
        toast.success("✅ Produit modifié avec succès");
      } else {
        console.log("➕ Données pour création:", produitData);

        const result = await produitService.createProduit(produitData);
        setProduits([...produits, result]);
        toast.success("✅ Produit ajouté avec succès");
      }

      resetForm();
      hideOffcanvas();
    } catch (error) {
      console.error("💥 Erreur:", error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const produit = produits.find((p) => p.id === id);
    if (!produit) return;

    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le produit "${produit.nom}" ?`
      )
    ) {
      try {
        await produitService.deleteProduit(id);
        setProduits(produits.filter((p) => p.id !== id));
        toast.info("🗑️ Produit supprimé");
      } catch (error) {
        toast.error(
          error.message || "Erreur lors de la suppression du produit"
        );
      }
    }
  };

  const handleEdit = (produit) => {
    setNewProduit({
      id: produit.id,
      nom: produit.nom || "",
      description: produit.description || "",
      categorie: produit.categorie || "",
      statut: produit.statut || "",
    });
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
      statut: "",
    });
  };

  const showOffcanvas = () => {
    const offcanvasElement = document.getElementById("offcanvasProduit");
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  const hideOffcanvas = () => {
    const offcanvasElement = document.getElementById("offcanvasProduit");
    if (offcanvasElement) {
      const offcanvas =
        window.bootstrap.Offcanvas.getInstance(offcanvasElement);
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
              <li
                className={styles.breadcrumbItem}
                onClick={() => navigate("/parametres")}
              >
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
              {loading && " (Chargement...)"}
            </p>
          </div>
          <button
            className={styles.addButton}
            onClick={handleAddClick}
            disabled={loading}
          >
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
              disabled={loading}
            />
          </div>
          <div className={styles.filterGroup}>
            <CIcon icon={cilFilter} className={styles.filterIcon} />
            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className={styles.filterSelect}
              disabled={loading}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              Liste des Produits ({filteredProduits.length})
              {loading && " - Chargement..."}
            </div>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>Chargement des produits...</div>
            </div>
          ) : (
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
                    <td colSpan="6" className={styles.emptyState}>
                      <CIcon icon={cilWarning} className={styles.emptyIcon} />
                      <div className={styles.emptyText}>
                        {produits.length === 0
                          ? "Aucun produit n'a été créé pour le moment"
                          : "Aucun produit ne correspond à votre recherche"}
                      </div>
                      {produits.length === 0 && (
                        <button
                          className={styles.emptyAction}
                          onClick={handleAddClick}
                        >
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
                        <span
                          className={`${
                            styles.statutBadge
                          } ${getStatutBadgeClass(produit.statut)}`}
                        >
                          {produit.statut === "actif" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEdit(produit)}
                            title="Modifier"
                            disabled={saving}
                          >
                            <CIcon icon={cilPencil} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(produit.id)}
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
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasProduit"
        >
          <div className={styles.offcanvasHeader}>
            <h5 className={styles.offcanvasTitle}>
              {isEditing ? "Modifier le produit" : "Nouveau produit"}
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mb-3">
                <label className={styles.formLabel}>Nom du produit *</label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={newProduit.nom}
                  onChange={(e) =>
                    setNewProduit({ ...newProduit, nom: e.target.value })
                  }
                  required
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formControl}
                  rows="3"
                  value={newProduit.description}
                  onChange={(e) =>
                    setNewProduit({
                      ...newProduit,
                      description: e.target.value,
                    })
                  }
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label className={styles.formLabel}>Catégorie</label>
                <select
                  className={styles.formControl}
                  value={newProduit.categorie}
                  onChange={(e) =>
                    setNewProduit({ ...newProduit, categorie: e.target.value })
                  }
                  disabled={saving}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className={styles.formLabel}>Statut</label>
                <select
                  className={styles.formControl}
                  value={newProduit.statut}
                  onChange={(e) =>
                    setNewProduit({ ...newProduit, statut: e.target.value })
                  }
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
                  {saving
                    ? "Enregistrement..."
                    : isEditing
                    ? "Mettre à jour"
                    : "Créer le produit"}
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

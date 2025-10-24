import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { clientService } from "../services/apiService";
import { 
  cilPencil, 
  cilTrash, 
  cilPlus,
  cilSearch,
  cilFilter,
  cilUser,
  cilEnvelopeOpen,
  cilPhone,
  cilMap,
  cilWarning
} from "@coreui/icons";
import styles from "../assets/css/Client.module.css";

function Client() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newClient, setNewClient] = useState({ 
    id: "", 
    nom: "", 
    email: "", 
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "",
    type: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const typesClient = ["Entreprise", "Particulier", "Administration", "Association"];

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (error) {
      toast.error("Erreur lors du chargement des clients");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.ville && client.ville.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || client.type === filterType;
    return matchesSearch && matchesType;
  });

  //  const handleSave = async () => {
  //   if (!newProduit.nom.trim()) {
  //     toast.error("Le nom est requis");
  //     return;
  //   }
  
  //   setSaving(true);
  //   try {
  //     const produitData = {
  //       nom: newProduit.nom.trim(),
  //       description: newProduit.description.trim(),
  //       categorie: newProduit.categorie,
  //       statut: newProduit.statut,
  //     };
  
  //     console.log('Données produit à sauvegarder:', produitData);
  
  //     if (isEditing) {
        
  //       const produitDataWithId = {
  //         id: parseInt(newProduit.id),
  //         ...produitData
  //       };
        
  //       console.log('Données pour modification:', produitDataWithId);
        
  //       const result = await produitService.updateProduit(newProduit.id, produitDataWithId);
  //       setProduits(produits.map(produit => 
  //         produit.id === newProduit.id ? { 
  //           ...produit,
  //           ...produitData
  //         } : produit
  //       ));
  //       toast.success("✅ Produit modifié avec succès");
  //     } else {
  //       console.log('➕ Données pour création:', produitData);
        
  //       const result = await produitService.createProduit(produitData);
  //       setProduits([...produits, result]);
  //       toast.success("✅ Produit ajouté avec succès");
  //     }

  const handleSave = async () => {
    if (!newClient.nom.trim() || !newClient.email.trim()) {
      toast.error("Le nom et l'email sont requis");
      return;
    }

    if (!isValidEmail(newClient.email)) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    setSaving(true);
    try {
      const clientData = {
        nom: newClient.nom.trim(),
        email: newClient.email.trim(),
        telephone: newClient.telephone.trim(),
        adresse: newClient.adresse.trim(),
        ville: newClient.ville.trim(),
        codePostal: newClient.codePostal.trim(),
        pays: newClient.pays,
        type: newClient.type
      };

      console.log('Données client à sauvegarder:', clientData);

      if (isEditing) {
        const clientDataWithId = {
          id: parseInt(newClient.id),
          ...clientData
        };
        
        console.log('Données pour modification:', clientDataWithId);

        const result = await clientService.updateClient(newClient.id, clientDataWithId);
        setClients(clients.map(c => 
          c.id === newClient.id ? { 
            ...c,
            ...clientData
          } : c
        ));
        toast.success("✅ Client modifié avec succès");
      } else {
        const result = await clientService.createClient(clientData);
        setClients([...clients, result]);
        toast.success("✅ Client ajouté avec succès");
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

  const handleDelete = async (id) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.nom}" ?`)) {
      try {
        await clientService.deleteClient(id);
        setClients(clients.filter(c => c.id !== id));
        toast.info("🗑️ Client supprimé");
      } catch (error) {
        toast.error(error.message || "Erreur lors de la suppression du client");
      }
    }
  };

  const handleEdit = (client) => {
    setNewClient({
      id: client.id,
      nom: client.nom || "",
      email: client.email || "",
      telephone: client.telephone || "",
      adresse: client.adresse || "",
      ville: client.ville || "",
      codePostal: client.codePostal || "",
      pays: client.pays || "",
      type: client.type || ""
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
    setNewClient({ 
      id: "", 
      nom: "", 
      email: "", 
      telephone: "",
      adresse: "",
      ville: "",
      codePostal: "",
      pays: "France",
      type: "Entreprise"
    });
  };

  const showOffcanvas = () => {
    const offcanvasElement = document.getElementById('offcanvasClient');
    if (offcanvasElement) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  const hideOffcanvas = () => {
    const offcanvasElement = document.getElementById('offcanvasClient');
    if (offcanvasElement) {
      const offcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) offcanvas.hide();
    }
  };

  const getTypeBadgeClass = (type) => {
    const typeMap = {
      "Entreprise": styles.typeEntreprise,
      "Particulier": styles.typeParticulier,
      "Administration": styles.typeAdministration,
      "Association": styles.typeAssociation
    };
    return typeMap[type] || styles.typeEntreprise;
  };

  const handlePhoneChange = (e) => {
  const input = e.target.value;
  
  // Garder seulement chiffres et espaces
  const cleanValue = input.replace(/[^\d\s]/g, '');
  
  // Enlever les espaces pour compter les chiffres
  const digitsOnly = cleanValue.replace(/\s/g, '');
  
  // Limiter à 10 chiffres et reformater
  const limitedDigits = digitsOnly.substring(0, 10);
  const formatted = formatPhoneNumber(limitedDigits);
  
  setNewClient({ ...newClient, telephone: formatted });
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
              <li className={styles.breadcrumbItemActive}>Clients</li>
            </ol>
          </nav>
        </div>

        {/* En-tête avec statistiques */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <CIcon icon={cilUser} className={styles.titleIcon} />
              Gestion des Clients
            </h1>
            <p className={styles.subtitle}>
              {clients.length} client(s) dans votre base de données
              {loading && " (Chargement...)"}
            </p>
          </div>
          <button className={styles.addButton} onClick={handleAddClick} disabled={loading}>
            <CIcon icon={cilPlus} className={styles.btnIcon} />
            Nouveau Client
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className={styles.filtersSection}>
          <div className={styles.searchBox}>
            <CIcon icon={cilSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              disabled={loading}
            />
          </div>
          <div className={styles.filterGroup}>
            <CIcon icon={cilFilter} className={styles.filterIcon} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.filterSelect}
              disabled={loading}
            >
              <option value="">Tous les types</option>
              {typesClient.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau des clients */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              Liste des Clients ({filteredClients.length})
              {loading && " - Chargement..."}
            </div>
          </div>
          
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>Chargement des clients...</div>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom/Entreprise</th>
                  <th>Contact</th>
                  <th>Adresse</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.emptyState}>
                      <CIcon icon={cilWarning} className={styles.emptyIcon} />
                      <div className={styles.emptyText}>
                        {clients.length === 0 
                          ? "Aucun client n'a été créé pour le moment" 
                          : "Aucun client ne correspond à votre recherche"
                        }
                      </div>
                      {clients.length === 0 && (
                        <button className={styles.emptyAction} onClick={handleAddClick}>
                          <CIcon icon={cilPlus} />
                          Ajouter le premier client
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className={styles.tableRow}>
                      <td className={styles.idCell}>#{client.id}</td>
                      <td className={styles.nomCell}>
                        <div className={styles.clientInfo}>
                          <strong>{client.nom}</strong>
                          <div className={styles.clientEmail}>
                            <CIcon icon={cilEnvelopeOpen} className={styles.infoIcon} />
                            {client.email}
                          </div>
                        </div>
                      </td>
                      <td className={styles.contactCell}>
                        {client.telephone && (
                          <div className={styles.contactInfo}>
                            <CIcon icon={cilPhone} className={styles.infoIcon} />
                            {client.telephone}
                          </div>
                        )}
                      </td>
                      <td className={styles.adresseCell}>
                        {client.adresse && (
                          <div className={styles.adresseInfo}>
                            <CIcon icon={cilMap} className={styles.infoIcon} />
                            <div>
                              <div>{client.adresse}</div>
                              {client.ville && (
                                <div className={styles.ville}>
                                  {client.codePostal} {client.ville}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className={styles.typeCell}>
                        <span className={`${styles.typeBadge} ${getTypeBadgeClass(client.type)}`}>
                          {client.type}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEdit(client)}
                            title="Modifier"
                            disabled={saving}
                          >
                            <CIcon icon={cilPencil} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(client.id)}
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
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasClient">
          <div className={styles.offcanvasHeader}>
            <h5 className={styles.offcanvasTitle}>
              {isEditing ? "Modifier le client" : "Nouveau client"}
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
                <label className={styles.formLabel}>Nom / Entreprise *</label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={newClient.nom}
                  onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Email *</label>
                <input
                  type="email"
                  className={styles.formControl}
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Téléphone</label>
                <input
                  type="tel"
                  className={styles.formControl}
                  value={newClient.telephone}
                  onChange={handlePhoneChange}
                  disabled={saving}
                  minLength={14}
                />
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Type de client</label>
                <select
                  className={styles.formControl}
                  value={newClient.type}
                  onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}
                  disabled={saving}
                >
                  {typesClient.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className={styles.formLabel}>Adresse</label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={newClient.adresse}
                  onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
                  placeholder="Rue, numéro..."
                  disabled={saving}
                />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className={styles.formLabel}>Code Postal</label>
                  <input
                    type="text"
                    className={styles.formControl}
                    value={newClient.codePostal}
                    onChange={(e) => setNewClient({ ...newClient, codePostal: e.target.value })}
                    disabled={saving}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label className={styles.formLabel}>Ville</label>
                  <input
                    type="text"
                    className={styles.formControl}
                    value={newClient.ville}
                    onChange={(e) => setNewClient({ ...newClient, ville: e.target.value })}
                    disabled={saving}
                  />
                </div>
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
                  {saving ? "Enregistrement..." : (isEditing ? "Mettre à jour" : "Créer le client")}
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

export default Client;
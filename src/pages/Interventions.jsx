import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useInterventions } from "../context/InterventionContext";
import styles from "../assets/css/Interventions.module.css";
import { Offcanvas } from "react-bootstrap";
import { generateRapportPDF } from "../utils/pdfGenerator";
import { useRapports } from "../context/RapportContext";
import { toast } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";
import CIcon from "@coreui/icons-react";
import {
  cilClock,
  cilArrowRight,
  cilBan,
  cilMediaStop,
  cilTrash,
  cilInfo,
  cilPlus,
  cilMediaPlay,
  cilCloudDownload,
  cilFile,
  cilMagnifyingGlass,
  cilCalendar,
  cilX,
  cilChevronLeft,
  cilChevronRight,
  cilZoom,
  cilCheckCircle,
  cilWarning
} from "@coreui/icons";

function Interventions() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const {
    interventions,
    startIntervention,
    finishIntervention,
    deleteIntervention,
  } = useInterventions();
  const { addRapport, rapports } = useRapports();
  const techniciens = ["Nacro", "Youssouf", "Issouf"];
  const typeIntervention = ["Maintenance", "Installation", "Dépannage"];

  // États pour la pagination et filtres
  const [activeTab, setActiveTab] = useState("enattente");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // États pour la modale de détails
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInterventionDetails, setSelectedInterventionDetails] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  const [rapport, setRapport] = useState({
    date: "",
    client: "",
    intervenant: "",
    type: "",
    description: "",
    observation: "",
    travaux: "",
  });

  // Vérifier si un rapport existe pour une intervention
const hasRapport = (interventionId) => {
  return rapports.some(rapport => rapport.interventionId === interventionId);
};

// Obtenir le rapport pour une intervention
const getRapportForIntervention = (interventionId) => {
  return rapports.find(rapport => rapport.interventionId === interventionId);
};

// Télécharger le rapport PDF
const handleDownloadRapport = async (intervention) => {
  const rapportExistant = getRapportForIntervention(intervention.id);
  
  if (!rapportExistant) {
    toast.error("⚠️ Vous devez d'abord générer le rapport avant de pouvoir le télécharger.");
    return;
  }

  try {
    await generateRapportPDF(rapportExistant, intervention);
    toast.success("📄 Rapport téléchargé avec succès !");
  } catch (error) {
    toast.error("❌ Erreur lors de la génération du PDF");
    console.error(error);
  }
};
  // 🔎 Filtrage
  const filteredInterventions = interventions
    .filter(i => {
      switch(activeTab) {
        case "enattente": return i.statut === "En attente";
        case "encours": return i.statut === "En cours";
        case "termine": return i.statut === "Terminé";
        default: return true;
      }
    })
    .filter(i =>
      search === "" ||
      i.client?.toLowerCase().includes(search.toLowerCase()) ||
      i.produit?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(i => {
      if (startDate && endDate) {
        const dateField = activeTab === "encours" ? i.date_demarre : i.date_demarre || i.datetime;
        return dateField >= startDate && dateField <= endDate;
      }
      return true;
    });

  // Pagination
  const totalPages = Math.ceil(filteredInterventions.length / rowsPerPage);
  const paginatedInterventions = filteredInterventions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Filtrer interventions par statut pour les compteurs
  const interventionsEnAttente = interventions.filter((i) => i.statut === "En attente");
  const interventionsEnCours = interventions.filter((i) => i.statut === "En cours");
  const interventionsTerminees = interventions.filter((i) => i.statut === "Terminé");

  // Format date lisible
  const formatDateTime = (iSoString) =>
    iSoString
      ? new Date(iSoString).toLocaleString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  // Ouvrir Offcanvas rapport
  const openReportForm = (intervention) => {
    setSelectedIntervention(intervention);
    
    const rapportExistant = getRapportForIntervention(intervention.id);
    
    if (rapportExistant) {
      setRapport(rapportExistant);
    } else {
      setRapport({
        date: new Date().toISOString().slice(0, 16),
        client: intervention.client || "",
        intervenant: "",
        type: "",
        description: intervention.description || "",
        observation: "",
        travaux: "",
      });
    }
    
    setShowOffcanvas(true);
  };

  // Ouvrir modale de détails
  const openDetailsModal = (intervention) => {
    setSelectedInterventionDetails(intervention);
    setShowDetailsModal(true);
  };

  // Fermer modale de détails
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedInterventionDetails(null);
    setLightboxImage(null);
    setZoomed(false);
  };

  const handleSaveRapport = () => {
    if (!selectedIntervention) return;

    const newRapport = {
      id: Date.now(),
      date: rapport.date,
      client: rapport.client,
      intervenant: rapport.intervenant,
      type: rapport.type,
      description: rapport.description,
      observation: rapport.observation,
      travaux: rapport.travaux,
      interventionId: selectedIntervention.id,
    };

    addRapport(newRapport);
    setShowOffcanvas(false);
    toast.success("✅ Rapport enregistré !");
  };

  const handleFinishIntervention = (intervention) => {
    finishIntervention(intervention.id);
    addNotification(`Intervention #${intervention.id} terminée ✅`);
    toast.success(`✅ Intervention #${intervention.id} terminée !`);
  };

  // Fonction pour obtenir la classe du badge selon le statut
  const getStatusBadgeClass = (statut) => {
    switch(statut) {
      case "En cours": return `${styles.statusBadge} ${styles.statusEnCours}`;
      case "Terminé": return `${styles.statusBadge} ${styles.statusTermine}`;
      case "En attente": return `${styles.statusBadge} ${styles.statusEnAttente}`;
      default: return styles.statusBadge;
    }
  };

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (statut) => {
    switch(statut) {
      case "En cours": return cilArrowRight;
      case "Terminé": return cilCheckCircle;
      case "En attente": return cilClock;
      default: return cilClock;
    }
  };

  // Fonction pour afficher le message quand le tableau est vide
  const renderEmptyMessage = (colSpan) => (
    <tr>
      <td colSpan={colSpan} className={styles.emptyCell}>
        <div className={styles.emptyMessage}>
          <CIcon icon={cilClock} size="3xl" className={styles.emptyIcon} />
          <div className={styles.emptyText}>
            Pas d'intervention {activeTab === "enattente" ? "en attente" : activeTab === "encours" ? "en cours" : "terminée"}.
          </div>
          {activeTab === "enattente" && (
            <button 
              className={styles.emptyAction}
              onClick={() => navigate("/ajouter_intervention")}
            >
              <CIcon icon={cilPlus} className={styles.btnIcon} />
              Créer une intervention
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  // Fonction pour afficher l'icône de téléchargement avec vérification
  const renderDownloadIcon = (intervention) => {
    const hasRapportForThis = hasRapport(intervention.id);
    
    return (
      <button
        className={`${styles.actionBtn} ${hasRapportForThis ? styles.downloadBtn : styles.disabledBtn}`}
        title={hasRapportForThis ? "Télécharger rapport" : "Vous devez d'abord générer le rapport"}
        onClick={() => hasRapportForThis ? handleDownloadRapport(intervention) : toast.error("⚠️ Vous devez d'abord générer le rapport")}
        disabled={!hasRapportForThis}
      >
        <CIcon icon={cilCloudDownload} />
      </button>
    );
  };

  // Fonction pour afficher les images
  const renderImages = (images) => {
    if (!images || images.length === 0) {
      return <div className={styles.noImages}>Aucune image</div>;
    }

    return (
      <div className={styles.imagesContainer}>
        {images.map((image, index) => {
          const imageUrl = typeof image === 'string' ? image : URL.createObjectURL(image);
          return (
            <div key={index} className={styles.imageItem}>
              <img 
                src={imageUrl} 
                alt={`Intervention ${index + 1}`}
                className={styles.detailImage}
                onClick={() => setLightboxImage({ src: imageUrl, index })}
              />
              <div className={styles.imageNumber}>{index + 1}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Navigation lightbox
  const prevImage = () => {
    if (!lightboxImage) return;
    const totalImages = selectedInterventionDetails?.images?.length || 0;
    setLightboxImage(prev => ({
      ...prev,
      index: prev.index === 0 ? totalImages - 1 : prev.index - 1
    }));
  };

  const nextImage = () => {
    if (!lightboxImage) return;
    const totalImages = selectedInterventionDetails?.images?.length || 0;
    setLightboxImage(prev => ({
      ...prev,
      index: prev.index === totalImages - 1 ? 0 : prev.index + 1
    }));
  };

  const toggleZoom = () => setZoomed(prev => !prev);

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "low": return "#10b981";
      case "medium": return "#f59e0b";
      case "high": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case "low": return "Basse";
      case "medium": return "Moyenne";
      case "high": return "Haute";
      default: return "Non définie";
    }
  };

  // Statistiques
  const stats = {
    total: interventions.length,
    enAttente: interventionsEnAttente.length,
    enCours: interventionsEnCours.length,
    terminees: interventionsTerminees.length
  };

  return (
    <div className={styles.container}>
      {/* En-tête avec statistiques */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <CIcon icon={cilClock} className={styles.titleIcon} />
            Gestion des Interventions
          </h1>
          <p className={styles.subtitle}>
            Suivez et gérez toutes vos interventions techniques
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={`${styles.statCard} ${styles.statPending}`}>
            <div className={styles.statValue}>{stats.enAttente}</div>
            <div className={styles.statLabel}>En attente</div>
          </div>
          <div className={`${styles.statCard} ${styles.statProgress}`}>
            <div className={styles.statValue}>{stats.enCours}</div>
            <div className={styles.statLabel}>En cours</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCompleted}`}>
            <div className={styles.statValue}>{stats.terminees}</div>
            <div className={styles.statLabel}>Terminées</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className={styles.quickActions}>
        <button 
          className={styles.primaryBtn}
          onClick={() => navigate("/ajouter_intervention")}
        >
          <CIcon icon={cilPlus} className={styles.btnIcon} />
          Nouvelle intervention
        </button>
        <button 
          className={styles.secondaryBtn}
          onClick={() => navigate("/incidents")}
        >
          <CIcon icon={cilWarning} className={styles.btnIcon} />
          Voir les incidents
        </button>
      </div>

      {/* Onglets */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "enattente" ? styles.tabActive : ""}`}
            onClick={() => { setActiveTab("enattente"); setCurrentPage(1); }}
          >
            <CIcon icon={cilClock} className={styles.tabIcon} />
            En attente
            <span className={styles.tabBadge}>{interventionsEnAttente.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "encours" ? styles.tabActive : ""}`}
            onClick={() => { setActiveTab("encours"); setCurrentPage(1); }}
          >
            <CIcon icon={cilArrowRight} className={styles.tabIcon} />
            En cours
            <span className={styles.tabBadge}>{interventionsEnCours.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "termine" ? styles.tabActive : ""}`}
            onClick={() => { setActiveTab("termine"); setCurrentPage(1); }}
          >
            <CIcon icon={cilCheckCircle} className={styles.tabIcon} />
            Terminé
            <span className={styles.tabBadge}>{interventionsTerminees.length}</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <CIcon icon={cilMagnifyingGlass} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher une intervention..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.dateFilters}>
          <div className={styles.dateGroup}>
            <CIcon icon={cilCalendar} className={styles.filterIcon} />
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className={styles.dateInput}
              placeholder="Date début"
            />
          </div>
          <span className={styles.dateSeparator}>à</span>
          <div className={styles.dateGroup}>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className={styles.dateInput}
              placeholder="Date fin"
            />
          </div>
        </div>
        {(search || startDate || endDate) && (
          <button 
            className={styles.clearFilters}
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
            }}
          >
            <CIcon icon={cilX} />
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Contenu principal */}
      <div className={styles.content}>
        {/* EN ATTENTE */}
        {activeTab === "enattente" && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID</th>
                  <th>Incident</th>
                  <th>Client</th>
                  <th>Produit</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInterventions.length === 0 
                  ? renderEmptyMessage(7)
                  : paginatedInterventions.map((i) => (
                    <tr key={i.id} className={styles.tableRow}>
                      <td className={styles.idCell}>#{i.id}</td>
                      <td className={styles.incidentCell}>
                        {i.incidentId ? `#${i.incidentId}` : '-'}
                      </td>
                      <td className={styles.clientCell}>{i.client}</td>
                      <td className={styles.productCell}>{i.produit}</td>
                      <td className={styles.priorityCell}>
                        <span 
                          className={styles.priorityBadge}
                          style={{ 
                            backgroundColor: `${getPriorityColor(i.priorite)}20`,
                            color: getPriorityColor(i.priorite),
                            borderColor: getPriorityColor(i.priorite)
                          }}
                        >
                          {getPriorityLabel(i.priorite)}
                        </span>
                      </td>
                      <td className={styles.statusCell}>
                        <span className={getStatusBadgeClass(i.statut)}>
                          <CIcon icon={getStatusIcon(i.statut)} className={styles.statusIcon} />
                          {i.statut}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.viewBtn}
                            onClick={() => openDetailsModal(i)}
                            title="Voir les détails"
                          >
                            <CIcon icon={cilInfo} />
                          </button>
                          <button
                            className={styles.startBtn}
                            onClick={() => startIntervention(i.id)}
                            title="Démarrer l'intervention"
                          >
                            <CIcon icon={cilArrowRight} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => {
                              if (window.confirm(`Supprimer l'intervention #${i.id} ?`)) {
                                deleteIntervention(i.id);
                                toast.success(`🗑️ Intervention #${i.id} supprimée !`);
                              }
                            }}
                            title="Supprimer"
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

        {/* EN COURS */}
        {activeTab === "encours" && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID</th>
                  <th>Incident</th>
                  <th>Client</th>
                  <th>Produit</th>
                  <th>Démarrée le</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Rapport</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInterventions.length === 0 
                  ? renderEmptyMessage(9)
                  : paginatedInterventions.map((i) => (
                    <tr key={i.id} className={styles.tableRow}>
                      <td className={styles.idCell}>#{i.id}</td>
                      <td className={styles.incidentCell}>
                        {i.incidentId ? `#${i.incidentId}` : '-'}
                      </td>
                      <td className={styles.clientCell}>{i.client}</td>
                      <td className={styles.productCell}>{i.produit}</td>
                      <td className={styles.dateCell}>{formatDateTime(i.startedAt)}</td>
                      <td className={styles.priorityCell}>
                        <span 
                          className={styles.priorityBadge}
                          style={{ 
                            backgroundColor: `${getPriorityColor(i.priorite)}20`,
                            color: getPriorityColor(i.priorite),
                            borderColor: getPriorityColor(i.priorite)
                          }}
                        >
                          {getPriorityLabel(i.priorite)}
                        </span>
                      </td>
                      <td className={styles.statusCell}>
                        <span className={getStatusBadgeClass(i.statut)}>
                          <CIcon icon={getStatusIcon(i.statut)} className={styles.statusIcon} />
                          {i.statut}
                        </span>
                      </td>
                      <td className={styles.reportCell}>
                        <div className={styles.reportActions}>
                          <button
                            className={styles.reportBtn}
                            onClick={() => openReportForm(i)}
                            title="Générer rapport"
                          >
                            <CIcon icon={cilFile} />
                          </button>
                          {renderDownloadIcon(i)}
                        </div>
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.viewBtn}
                            onClick={() => openDetailsModal(i)}
                            title="Voir les détails"
                          >
                            <CIcon icon={cilInfo} />
                          </button>
                          <button
                            className={styles.finishBtn}
                            onClick={() => handleFinishIntervention(i)}
                            title="Terminer l'intervention"
                          >
                            <CIcon icon={cilBan} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => {
                              if (window.confirm(`Supprimer l'intervention #${i.id} ?`)) {
                                deleteIntervention(i.id);
                                toast.success(`🗑️ Intervention #${i.id} supprimée !`);
                              }
                            }}
                            title="Supprimer"
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

        {/* TERMINE */}
        {activeTab === "termine" && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>ID</th>
                  <th>Incident</th>
                  <th>Client</th>
                  <th>Produit</th>
                  <th>Démarrée le</th>
                  <th>Terminée le</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Rapport</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInterventions.length === 0 
                  ? renderEmptyMessage(10)
                  : paginatedInterventions.map((i) => (
                    <tr key={i.id} className={styles.tableRow}>
                      <td className={styles.idCell}>#{i.id}</td>
                      <td className={styles.incidentCell}>
                        {i.incidentId ? `#${i.incidentId}` : '-'}
                      </td>
                      <td className={styles.clientCell}>{i.client}</td>
                      <td className={styles.productCell}>{i.produit}</td>
                      <td className={styles.dateCell}>{formatDateTime(i.startedAt)}</td>
                      <td className={styles.dateCell}>{formatDateTime(i.endedAt)}</td>
                      <td className={styles.priorityCell}>
                        <span 
                          className={styles.priorityBadge}
                          style={{ 
                            backgroundColor: `${getPriorityColor(i.priorite)}20`,
                            color: getPriorityColor(i.priorite),
                            borderColor: getPriorityColor(i.priorite)
                          }}
                        >
                          {getPriorityLabel(i.priorite)}
                        </span>
                      </td>
                      <td className={styles.statusCell}>
                        <span className={getStatusBadgeClass(i.statut)}>
                          <CIcon icon={getStatusIcon(i.statut)} className={styles.statusIcon} />
                          {i.statut}
                        </span>
                      </td>
                      <td className={styles.reportCell}>
                        <div className={styles.reportActions}>
                          <button
                            className={styles.reportBtn}
                            onClick={() => openReportForm(i)}
                            title="Voir/modifier rapport"
                          >
                            <CIcon icon={cilFile} />
                          </button>
                          {renderDownloadIcon(i)}
                        </div>
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.viewBtn}
                            onClick={() => openDetailsModal(i)}
                            title="Voir les détails"
                          >
                            <CIcon icon={cilInfo} />
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => {
                              if (window.confirm(`Supprimer l'intervention #${i.id} ?`)) {
                                deleteIntervention(i.id);
                                toast.success(`🗑️ Intervention #${i.id} supprimée !`);
                              }
                            }}
                            title="Supprimer"
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <CIcon icon={cilChevronLeft} />
            Précédent
          </button>
          
          <div className={styles.paginationNumbers}>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.activePage : ""}`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            className={styles.paginationBtn}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
            <CIcon icon={cilChevronRight} />
          </button>
        </div>
      )}

      

      {/* Modale de détails */}
      {showDetailsModal && selectedInterventionDetails && (
        <div className={styles.modalOverlay} onClick={closeDetailsModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <CIcon icon={getStatusIcon(selectedInterventionDetails.statut)} className={styles.modalTitleIcon} />
                Détails de l'intervention #{selectedInterventionDetails.id}
              </h2>
              <button className={styles.modalClose} onClick={closeDetailsModal}>
                <CIcon icon={cilX} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {/* Informations principales */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Informations principales</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Client:</span>
                    <span className={styles.detailValue}>{selectedInterventionDetails.client}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Produit:</span>
                    <span className={styles.detailValue}>{selectedInterventionDetails.produit}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Statut:</span>
                    <span className={getStatusBadgeClass(selectedInterventionDetails.statut)}>
                      <CIcon icon={getStatusIcon(selectedInterventionDetails.statut)} className={styles.statusIcon} />
                      {selectedInterventionDetails.statut}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Priorité:</span>
                    <span 
                      className={styles.detailValue}
                      style={{ color: getPriorityColor(selectedInterventionDetails.priorite) }}
                    >
                      {getPriorityLabel(selectedInterventionDetails.priorite)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Incident associé:</span>
                    <span className={styles.detailValue}>
                      {selectedInterventionDetails.incidentId ? `#${selectedInterventionDetails.incidentId}` : 'Aucun'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates et technicien */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Planification</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date planifiée:</span>
                    <span className={styles.detailValue}>
                      {selectedInterventionDetails.datetime ? formatDateTime(selectedInterventionDetails.datetime) : '-'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Technicien:</span>
                    <span className={styles.detailValue}>
                      {selectedInterventionDetails.technicien || 'Non assigné'}
                    </span>
                  </div>
                  {selectedInterventionDetails.startedAt && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Démarrée le:</span>
                      <span className={styles.detailValue}>{formatDateTime(selectedInterventionDetails.startedAt)}</span>
                    </div>
                  )}
                  {selectedInterventionDetails.endedAt && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Terminée le:</span>
                      <span className={styles.detailValue}>{formatDateTime(selectedInterventionDetails.endedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <div className={styles.detailItem}>
                  <p className={styles.detailDescription}>
                    {selectedInterventionDetails.description || 'Aucune description'}
                  </p>
                </div>
              </div>

              {/* Images */}
              {selectedInterventionDetails.images && selectedInterventionDetails.images.length > 0 && (
                <div className={styles.detailSection}>
                  <h3 className={styles.sectionTitle}>Images ({selectedInterventionDetails.images.length})</h3>
                  {renderImages(selectedInterventionDetails.images)}
                </div>
              )}

              {/* Actions dans la modale */}
              <div className={styles.modalActions}>
                {selectedInterventionDetails.statut === "En attente" && (
                  <button 
                    className={styles.startBtn}
                    onClick={() => {
                      startIntervention(selectedInterventionDetails.id);
                      closeDetailsModal();
                      toast.success(`🚀 Intervention #${selectedInterventionDetails.id} démarrée !`);
                    }}
                  >
                    <CIcon icon={cilMediaPlay} />
                    Démarrer l'intervention
                  </button>
                )}
                {selectedInterventionDetails.statut === "En cours" && (
                  <button 
                    className={styles.finishBtn}
                    onClick={() => {
                      handleFinishIntervention(selectedInterventionDetails);
                      closeDetailsModal();
                    }}
                  >
                    <CIcon icon={cilMediaStop} />
                    Terminer l'intervention
                  </button>
                )}
                {selectedInterventionDetails.statut !== "En attente" && (
                <button 
                  className={styles.reportBtn}
                  onClick={() => {
                    openReportForm(selectedInterventionDetails);
                    closeDetailsModal();
                  }}
                >
                  <CIcon icon={cilFile} />
                  {hasRapport(selectedInterventionDetails.id) ? 'Modifier le rapport' : 'Créer un rapport'}
                </button>
                )}
              </div>
                
            </div>
          </div>
        </div>
      )}

      {/* Lightbox pour images */}
      {lightboxImage && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImage(null)}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.lightboxClose}
              onClick={() => setLightboxImage(null)}
            >
              <CIcon icon={cilX} />
            </button>

            <div className={styles.lightboxImageContainer}>
              <img 
                src={lightboxImage.src} 
                alt="Détail" 
                className={`${styles.lightboxImage} ${zoomed ? styles.zoomed : ""}`}
                onClick={toggleZoom}
              />
              <button 
                className={styles.zoomHint}
                onClick={toggleZoom}
              >
                <CIcon icon={cilZoom} />
                {zoomed ? 'Dézoomer' : 'Zoomer'}
              </button>
            </div>

            {selectedInterventionDetails?.images && selectedInterventionDetails.images.length > 1 && (
              <>
                <button className={styles.lightboxNav} onClick={prevImage} title="Image précédente">
                  <CIcon icon={cilChevronLeft} />
                </button>
                <button className={styles.lightboxNav} onClick={nextImage} title="Image suivante">
                  <CIcon icon={cilChevronRight} />
                </button>
                <div className={styles.lightboxCounter}>
                  {lightboxImage.index + 1} / {selectedInterventionDetails.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Offcanvas Rapport d'intervention */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        style={{ width: "600px" }}
        className={styles.offcanvas}
      >
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title className={styles.offcanvasTitle}>
            <CIcon icon={cilFile} className={styles.offcanvasTitleIcon} />
            Rapport d'intervention {selectedIntervention ? `#${selectedIntervention.id}` : ''}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.offcanvasBody}>
          <form>
            <div className="mb-3">
              <label className="form-label">Date du rapport</label>
              <input
                type="datetime-local"
                className="form-control"
                value={rapport.date}
                onChange={(e) => setRapport({ ...rapport, date: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Client</label>
              <input
                type="text"
                className="form-control"
                value={rapport.client}
                onChange={(e) => setRapport({ ...rapport, client: e.target.value })}
                placeholder="Nom du client"
              />
            </div>

            <div className="mb-3">
  <label className="form-label">Intervenant</label>
  <select
    className="form-select"
    value={rapport.intervenant}
    onChange={(e) => setRapport({ ...rapport, intervenant: e.target.value })}
  >
    <option value="" disabled>
      -- Sélectionner un intervenant --
    </option>
    {techniciens.map((t, idx) => (
      <option key={idx} value={t}>
        {t}
      </option>
    ))}
  </select>
</div>


            <div className="mb-3">
              <label className="form-label">Type d'intervention</label>
              <select
                className="form-select"
                value={rapport.type}
                onChange={(e) => setRapport({ ...rapport, type: e.target.value })}
              >
                <option value="" disabled>
                  -- Sélectionner un type d'intervention --
                </option>
                {typeIntervention.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={rapport.description}
                onChange={(e) => setRapport({ ...rapport, description: e.target.value })}
                placeholder="Description de l'intervention"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Observations</label>
              <textarea
                className="form-control"
                rows="3"
                value={rapport.observation}
                onChange={(e) => setRapport({ ...rapport, observation: e.target.value })}
                placeholder="Observations sur l'intervention"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Travaux effectués</label>
              <textarea
                className="form-control"
                rows="3"
                value={rapport.travaux}
                onChange={(e) => setRapport({ ...rapport, travaux: e.target.value })}
                placeholder="Détail des travaux réalisés"
              />
            </div>

            <div className="d-grid gap-2">
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={handleSaveRapport}
              >
                <CIcon icon={cilCheckCircle} className="me-2" />
                Enregistrer le rapport
              </button>
              
              {hasRapport(selectedIntervention?.id) && (
  <button 
    type="button" 
    className="btn btn-primary" 
    onClick={() => handleDownloadRapport(selectedIntervention)}
  >
    <CIcon icon={cilCloudDownload} className="me-2" />
    Télécharger le rapport PDF
  </button>
)}
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Interventions;
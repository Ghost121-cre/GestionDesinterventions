import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useIncident } from "../context/IncidentContext";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/Incident.module.css";
import CIcon from "@coreui/icons-react";
import { 
  cilWarning, 
  cilCheckCircle, 
  cilMagnifyingGlass,
  cilCalendar,
  cilTrash,
  cilInfo,
  cilX,
  cilChevronLeft,
  cilChevronRight,
  cilZoomIn,
  cilPlus,
  cilFilter
} from "@coreui/icons";
import { toast } from "react-toastify";

function Incident() {
  const navigate = useNavigate();
  const { incidents, handleDelete, handleMarkResolved } = useIncident();
  const [activeTab, setActiveTab] = useState("nonresolu");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [zoomed, setZoomed] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const rowsPerPage = 10;

  // 🔎 Filtrage selon onglet, recherche et dates
  const filteredIncidents = incidents
    .filter(i => i.statut === (activeTab === "nonresolu" ? "non résolu" : "résolu"))
    .filter(i => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        i.client?.toLowerCase().includes(searchLower) ||
        i.produit?.toLowerCase().includes(searchLower) ||
        i.description?.toLowerCase().includes(searchLower)
      );
    })
    .filter(i => {
      if (!startDate && !endDate) return true;
      
      const dateField = activeTab === "nonresolu" ? i.date_survenu : i.date_resolu || i.date_survenu;
      if (!dateField) return false;
      
      const incidentDate = new Date(dateField);
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return incidentDate >= start && incidentDate <= end;
      }
      
      if (startDate) {
        const start = new Date(startDate);
        return incidentDate >= start;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        return incidentDate <= end;
      }
      
      return true;
    });

  const totalPages = Math.ceil(filteredIncidents.length / rowsPerPage);
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Navigation lightbox
  const prevImage = () =>
    setLightboxIndex(prev => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  
  const nextImage = () =>
    setLightboxIndex(prev => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  
  const toggleZoom = () => setZoomed(prev => !prev);

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomed(false);
  };

  // Ouvrir les détails d'un incident
  const openDetailsModal = (incident) => {
    setSelectedIncident(incident);
    setShowDetailsModal(true);
  };

  // Fermer les détails
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedIncident(null);
  };

  // Marquer comme résolu avec confirmation
  const handleResolve = (incident) => {
    if (window.confirm(`Marquer l'incident #${incident.id} comme résolu ?`)) {
      handleMarkResolved(incident.id);
      toast.success(`✅ Incident #${incident.id} marqué comme résolu !`);
    }
  };

  // Supprimer avec confirmation
  const confirmDelete = (incident) => {
    if (window.confirm(`Supprimer définitivement l'incident #${incident.id} ?`)) {
      handleDelete(incident.id);
      toast.success(`🗑️ Incident #${incident.id} supprimé !`);
    }
  };

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "low": return "#10b981";
      case "medium": return "#f59e0b";
      case "high": return "#ef4444";
      default: return "#6b7280";
    }
  };

  // Obtenir le libellé de priorité
  const getPriorityLabel = (priority) => {
    switch(priority) {
      case "low": return "Basse";
      case "medium": return "Moyenne";
      case "high": return "Haute";
      default: return "Non définie";
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return "-";
    }
  };

  // Obtenir les URLs des images
  const getImageUrls = (images) => {
    if (!images || images.length === 0) return [];
    return images.map(img => {
      if (typeof img === "string") return img;
      if (img instanceof File || img instanceof Blob) {
        return URL.createObjectURL(img);
      }
      return img;
    });
  };

  // Ouvrir la lightbox depuis le tableau
  const openLightboxFromTable = (images, index) => {
    const urls = getImageUrls(images);
    setLightboxImages(urls);
    setLightboxIndex(index);
  };

  // Ouvrir la lightbox depuis la modal de détails
  const openLightboxFromModal = (images, index) => {
    const urls = getImageUrls(images);
    setLightboxImages(urls);
    setLightboxIndex(index);
    closeDetailsModal(); // Fermer la modal de détails
  };

  // Nettoyer les URLs des images créées
  useEffect(() => {
    return () => {
      lightboxImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [lightboxImages]);

  // Statistiques
  const stats = {
    total: incidents.length,
    nonResolus: incidents.filter(i => i.statut === "non résolu").length,
    resolus: incidents.filter(i => i.statut === "résolu").length
  };

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, startDate, endDate]);

  return (
    <div className={styles.container}>
      {/* En-tête avec statistiques */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <CIcon icon={cilWarning} className={styles.titleIcon} />
            Gestion des Incidents
          </h1>
          <p className={styles.subtitle}>
            Surveillez et gérez tous les incidents signalés
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={`${styles.statCard} ${styles.statPending}`}>
            <div className={styles.statValue}>{stats.nonResolus}</div>
            <div className={styles.statLabel}>En attente</div>
          </div>
          <div className={`${styles.statCard} ${styles.statResolved}`}>
            <div className={styles.statValue}>{stats.resolus}</div>
            <div className={styles.statLabel}>Résolus</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className={styles.quickActions}>
        <button 
          className={styles.primaryBtn}
          onClick={() => navigate("/declarer_incident")}
        >
          <CIcon icon={cilPlus} className={styles.btnIcon} />
          Déclarer un incident
        </button>
        <button 
          className={styles.secondaryBtn}
          onClick={() => navigate("/interventions")}
        >
          <CIcon icon={cilInfo} className={styles.btnIcon} />
          Voir les interventions
        </button>
      </div>

      {/* Onglets */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "nonresolu" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("nonresolu")}
          >
            <CIcon icon={cilWarning} className={styles.tabIcon} />
            Incidents non résolus
            <span className={styles.tabBadge}>{stats.nonResolus}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "resolu" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("resolu")}
          >
            <CIcon icon={cilCheckCircle} className={styles.tabIcon} />
            Incidents résolus
            <span className={styles.tabBadge}>{stats.resolus}</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <CIcon icon={cilMagnifyingGlass} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher un incident..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
            />
          </div>
          <span className={styles.dateSeparator}>à</span>
          <div className={styles.dateGroup}>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className={styles.dateInput}
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

      {/* Tableau */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>ID</th>
              <th>Client</th>
              <th>Produit</th>
              <th>Priorité</th>
              <th>Images</th>
              <th>Description</th>
              <th>{activeTab === "resolu" ? "Date Résolution" : "Date Survenue"}</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIncidents.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.emptyState}>
                  <CIcon icon={activeTab === "nonresolu" ? cilWarning : cilCheckCircle} size="3xl" />
                  <div className={styles.emptyText}>
                    Aucun incident {activeTab === "nonresolu" ? "non résolu" : "résolu"} trouvé
                  </div>
                  {activeTab === "nonresolu" && (
                    <button 
                      className={styles.emptyAction}
                      onClick={() => navigate("/declarer_incident")}
                    >
                      <CIcon icon={cilPlus} />
                      Déclarer le premier incident
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedIncidents.map(i => (
                <tr key={i.id} className={styles.tableRow}>
                  <td className={styles.idCell}>#{i.id}</td>
                  <td className={styles.clientCell}>
                    <span className={styles.clientBadge}>{i.client}</span>
                  </td>
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
                  <td className={styles.imagesCell}>
                    <div className={styles.previewContainer}>
                      {i.images && i.images.length > 0 ? (
                        i.images.slice(0, 3).map((img, idx) => (
                          <div key={idx} className={styles.imageWrapper}>
                            <img
                              src={typeof img === "string" ? img : URL.createObjectURL(img)}
                              alt={`Incident ${i.id} - ${idx + 1}`}
                              className={styles.previewImage}
                              onClick={() => openLightboxFromTable(i.images, idx)}
                            />
                            {i.images.length > 3 && idx === 2 && (
                              <div className={styles.moreImages}>+{i.images.length - 3}</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className={styles.noImages}>Aucune</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.descriptionCell}>
                    <div className={styles.description}>
                      {i.description?.length > 100 ? `${i.description.substring(0, 100)}...` : i.description}
                    </div>
                    <button 
                      className={styles.viewDetailsBtn}
                      onClick={() => openDetailsModal(i)}
                    >
                      <CIcon icon={cilInfo} />
                      Voir détails
                    </button>
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(activeTab === "resolu" ? i.date_resolu : i.date_survenu)}
                  </td>
                  <td className={styles.statusCell}>
                    <span className={i.statut === "résolu" ? styles.badgeResolved : styles.badgePending}>
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
                      {activeTab === "nonresolu" && (
                        <button
                          className={styles.resolveBtn}
                          onClick={() => handleResolve(i)}
                          title="Marquer comme résolu"
                        >
                          <CIcon icon={cilCheckCircle} />
                        </button>
                      )}
                      <button
                        className={styles.deleteBtn}
                        onClick={() => confirmDelete(i)}
                        title="Supprimer l'incident"
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

      {/* Modal de détails */}
      {showDetailsModal && selectedIncident && (
        <div className={styles.modalOverlay} onClick={closeDetailsModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Détails de l'incident #{selectedIncident.id}
              </h2>
              <button className={styles.modalClose} onClick={closeDetailsModal}>
                <CIcon icon={cilX} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Client:</span>
                  <span className={styles.detailValue}>{selectedIncident.client}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Produit:</span>
                  <span className={styles.detailValue}>{selectedIncident.produit}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Priorité:</span>
                  <span 
                    className={styles.detailValue}
                    style={{ color: getPriorityColor(selectedIncident.priorite) }}
                  >
                    {getPriorityLabel(selectedIncident.priorite)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Statut:</span>
                  <span className={selectedIncident.statut === "résolu" ? styles.badgeResolved : styles.badgePending}>
                    {selectedIncident.statut}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date de survenue:</span>
                  <span className={styles.detailValue}>{formatDate(selectedIncident.date_survenu)}</span>
                </div>
                {selectedIncident.date_resolu && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date de résolution:</span>
                    <span className={styles.detailValue}>{formatDate(selectedIncident.date_resolu)}</span>
                  </div>
                )}
              </div>

              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.fullDescription}>{selectedIncident.description}</p>
              </div>

              {selectedIncident.images && selectedIncident.images.length > 0 && (
                <div className={styles.imagesSection}>
                  <h3 className={styles.sectionTitle}>Images ({selectedIncident.images.length})</h3>
                  <div className={styles.modalImages}>
                    {getImageUrls(selectedIncident.images).map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Incident ${selectedIncident.id} - ${idx + 1}`}
                        className={styles.modalImage}
                        onClick={() => openLightboxFromModal(selectedIncident.images, idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.modalActions}>
                {selectedIncident.statut === "non résolu" && (
                  <button 
                    className={styles.resolveBtn}
                    onClick={() => {
                      handleResolve(selectedIncident);
                      closeDetailsModal();
                    }}
                  >
                    <CIcon icon={cilCheckCircle} />
                    Marquer comme résolu
                  </button>
                )}
                <button 
                  className={styles.createInterventionBtn}
                  onClick={() => {
                    navigate("/ajouter_intervention", { state: { incident: selectedIncident } });
                    closeDetailsModal();
                  }}
                >
                  <CIcon icon={cilPlus} />
                  Créer une intervention
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => {
                    confirmDelete(selectedIncident);
                    closeDetailsModal();
                  }}
                >
                  <CIcon icon={cilTrash} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal amélioré */}
      {lightboxIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.lightboxClose}
              onClick={closeLightbox}
              title="Fermer"
            >
              <CIcon icon={cilX} />
            </button>

            <div className={styles.lightboxImageContainer}>
              <img
                src={lightboxImages[lightboxIndex]}
                alt="Aperçu"
                className={`${styles.lightboxImage} ${zoomed ? styles.zoomed : ""}`}
                onClick={toggleZoom}
              />
              <button 
                className={styles.zoomHint}
                onClick={toggleZoom}
              >
                <CIcon icon={cilZoomIn} />
                {zoomed ? 'Dézoomer' : 'Zoomer'}
              </button>
            </div>

            {lightboxImages.length > 1 && (
              <>
                <button className={styles.lightboxNav} onClick={prevImage} title="Image précédente">
                  <CIcon icon={cilChevronLeft} />
                </button>
                <button className={styles.lightboxNav} onClick={nextImage} title="Image suivante">
                  <CIcon icon={cilChevronRight} />
                </button>
                <div className={styles.lightboxCounter}>
                  {lightboxIndex + 1} / {lightboxImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Incident;
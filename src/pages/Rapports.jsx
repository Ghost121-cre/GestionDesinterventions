import React, { useState, useMemo } from "react";
import { useRapports } from "../context/RapportContext";
import { useInterventions } from "../context/InterventionContext";
import { toast } from "react-toastify";
import { generateRapportPDF } from "../utils/pdfGenerator";
import styles from "../assets/css/Rapports.module.css";
import CIcon from "@coreui/icons-react";
import {
  cilFile,
  cilUser,
  cilChartLine,
  cilMagnifyingGlass,
  cilCalendar,
  cilTrash,
  cilCloudDownload,
  cilX,
  cilChevronLeft,
  cilChevronRight,
  cilInfo,
  cilWarning
} from "@coreui/icons";

function Rapports() {
  const { rapports, deleteRapport } = useRapports();
  const { interventions } = useInterventions();

  // États pour la pagination et filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Clients uniques pour le filtre
  const uniqueClients = useMemo(() => {
    return [...new Set(rapports.map(r => r.client).filter(Boolean))];
  }, [rapports]);

  // Filtrer les rapports
  const filteredRapports = useMemo(() => {
    return rapports
      .filter(rapport =>
        search === "" ||
        rapport.client?.toLowerCase().includes(search.toLowerCase()) ||
        rapport.intervenant?.toLowerCase().includes(search.toLowerCase()) ||
        rapport.description?.toLowerCase().includes(search.toLowerCase()) ||
        rapport.type?.toLowerCase().includes(search.toLowerCase()) ||
        rapport.travaux?.toLowerCase().includes(search.toLowerCase()) ||
        rapport.observation?.toLowerCase().includes(search.toLowerCase())
      )
      .filter(rapport => {
        if (startDate && endDate) {
          const rapportDate = rapport.date ? new Date(rapport.date) : null;
          if (!rapportDate) return false;
          return rapportDate >= new Date(startDate) && rapportDate <= new Date(endDate);
        }
        return true;
      })
      .filter(rapport =>
        clientFilter === "" ||
        rapport.client?.toLowerCase().includes(clientFilter.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante
  }, [rapports, search, startDate, endDate, clientFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRapports.length / rowsPerPage);
  const paginatedRapports = filteredRapports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Statistiques améliorées
  const stats = useMemo(() => {
    const totalRapports = rapports.length;
    const rapportsAvecIntervenant = rapports.filter(r => r.intervenant).length;
    
    const rapportsCeMois = rapports.filter(r => {
      const rapportDate = new Date(r.date);
      const now = new Date();
      return rapportDate.getMonth() === now.getMonth() && 
             rapportDate.getFullYear() === now.getFullYear();
    }).length;

    const rapportsCetteSemaine = rapports.filter(r => {
      const rapportDate = new Date(r.date);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return rapportDate >= startOfWeek && rapportDate <= endOfWeek;
    }).length;

    // Top clients
    const clientCounts = rapports.reduce((acc, rapport) => {
      if (rapport.client) {
        acc[rapport.client] = (acc[rapport.client] || 0) + 1;
      }
      return acc;
    }, {});

    const topClient = Object.entries(clientCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      total: totalRapports,
      avecIntervenant: rapportsAvecIntervenant,
      ceMois: rapportsCeMois,
      cetteSemaine: rapportsCetteSemaine,
      topClient: topClient ? { nom: topClient[0], count: topClient[1] } : null
    };
  }, [rapports]);

  const handleDelete = (id, client) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le rapport pour ${client} ?`)) {
      deleteRapport(id);
      toast.error("🗑️ Rapport supprimé");
    }
  };

  const getInterventionForRapport = (rapport) => {
    return interventions.find(intervention => intervention.id === rapport.interventionId);
  };

  const handleDownload = (rapport) => {
    const interventionAssociee = getInterventionForRapport(rapport);
    
    if (!interventionAssociee) {
      toast.error("❌ Intervention associée non trouvée");
      return;
    }

    try {
      generateRapportPDF(rapport, interventionAssociee);
      toast.success("📄 Rapport téléchargé avec succès !");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("❌ Erreur lors du téléchargement du rapport");
    }
  };

  const openDetailsModal = (rapport) => {
    setSelectedRapport(rapport);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRapport(null);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setClientFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || startDate || endDate || clientFilter;

  return (
    <div className={styles.container}>
      {/* En-tête */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <CIcon icon={cilFile} className={styles.titleIcon} />
            Gestion des Rapports
          </h1>
          <p className={styles.subtitle}>
            Consultez et gérez tous vos rapports d'intervention
          </p>
        </div>
      </div>

      {/* Statistiques améliorées */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CIcon icon={cilFile} size="2xl" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Rapports Totaux</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CIcon icon={cilUser} size="2xl" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.avecIntervenant}</div>
            <div className={styles.statLabel}>Avec Intervenant</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CIcon icon={cilChartLine} size="2xl" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.ceMois}</div>
            <div className={styles.statLabel}>Ce Mois</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CIcon icon={cilChartLine} size="2xl" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.cetteSemaine}</div>
            <div className={styles.statLabel}>Cette Semaine</div>
          </div>
        </div>

        {stats.topClient && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CIcon icon={cilUser} size="2xl" />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stats.topClient.count}</div>
              <div className={styles.statLabel}>Top: {stats.topClient.nom}</div>
            </div>
          </div>
        )}
      </div>

      {/* Filtres améliorés */}
      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <CIcon icon={cilMagnifyingGlass} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <CIcon icon={cilUser} className={styles.filterIcon} />
            <select
              value={clientFilter}
              onChange={e => { setClientFilter(e.target.value); setCurrentPage(1); }}
              className={styles.selectFilter}
            >
              <option value="">Tous les clients</option>
              {uniqueClients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          <div className={styles.dateFilters}>
            <div className={styles.dateGroup}>
              <CIcon icon={cilCalendar} className={styles.filterIcon} />
              <input
                type="date"
                value={startDate}
                onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
                className={styles.dateInput}
                placeholder="Date début"
              />
            </div>
            <span className={styles.dateSeparator}>à</span>
            <div className={styles.dateGroup}>
              <input
                type="date"
                value={endDate}
                onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
                className={styles.dateInput}
                placeholder="Date fin"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button 
              className={styles.clearFilters}
              onClick={clearFilters}
            >
              <CIcon icon={cilX} />
              Effacer les filtres
            </button>
          )}
        </div>

        {/* Résultats de recherche */}
        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>
            {filteredRapports.length} rapport(s) trouvé(s)
            {hasActiveFilters && " (filtrés)"}
          </span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={styles.content}>
        {/* Tableau des rapports amélioré */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>ID</th>
                <th>Client</th>
                <th>Intervenant</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Intervention</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRapports.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.emptyState}>
                    <div className={styles.emptyMessage}>
                      <CIcon icon={cilFile} size="3xl" className={styles.emptyIcon} />
                      <div className={styles.emptyText}>
                        {rapports.length === 0 
                          ? "Aucun rapport n'a été généré pour le moment." 
                          : "Aucun rapport ne correspond aux critères de recherche."
                        }
                      </div>
                      {hasActiveFilters && (
                        <button 
                          className={styles.emptyAction}
                          onClick={clearFilters}
                        >
                          <CIcon icon={cilX} />
                          Effacer les filtres
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRapports.map((rapport, index) => (
                  <tr key={rapport.id} className={styles.tableRow}>
                    <td className={styles.idCell}>
                      #{(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className={styles.clientCell}>
                      <span className={styles.clientBadge}>{rapport.client}</span>
                    </td>
                    <td className={styles.intervenantCell}>
                      {rapport.intervenant || 
                        <span className={styles.notSpecified}>Non spécifié</span>
                      }
                    </td>
                    <td className={styles.typeCell}>
                      {rapport.type || 
                        <span className={styles.notSpecified}>Non spécifié</span>
                      }
                    </td>
                    <td className={styles.descriptionCell}>
                      <div className={styles.description}>
                        {rapport.description ? 
                          (rapport.description.length > 80 ? 
                            `${rapport.description.substring(0, 80)}...` : 
                            rapport.description
                          ) : 
                          <span className={styles.notSpecified}>Aucune description</span>
                        }
                      </div>
                      <button 
                        className={styles.viewDetailsBtn}
                        onClick={() => openDetailsModal(rapport)}
                      >
                        <CIcon icon={cilInfo} />
                        Voir détails
                      </button>
                    </td>
                    <td className={styles.dateCell}>
                      {formatDate(rapport.date)}
                    </td>
                    <td className={styles.interventionCell}>
                      <span className={styles.interventionId}>
                        #{rapport.interventionId}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.viewBtn}
                          onClick={() => openDetailsModal(rapport)}
                          title="Voir les détails"
                        >
                          <CIcon icon={cilInfo} />
                        </button>
                        <button
                          className={styles.downloadBtn}
                          onClick={() => handleDownload(rapport)}
                          title="Télécharger PDF"
                        >
                          <CIcon icon={cilCloudDownload} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(rapport.id, rapport.client)}
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

        {/* Pagination améliorée */}
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
      </div>

      {/* Modal de détails du rapport */}
      {showDetailsModal && selectedRapport && (
        <div className={styles.modalOverlay} onClick={closeDetailsModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <CIcon icon={cilFile} className={styles.modalTitleIcon} />
                Détails du Rapport #{rapports.findIndex(r => r.id === selectedRapport.id) + 1}
              </h2>
              <button className={styles.modalClose} onClick={closeDetailsModal}>
                <CIcon icon={cilX} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Client:</span>
                  <span className={styles.detailValue}>{selectedRapport.client}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Intervenant:</span>
                  <span className={styles.detailValue}>
                    {selectedRapport.intervenant || 
                      <span className={styles.notSpecified}>Non spécifié</span>
                    }
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Type d'intervention:</span>
                  <span className={styles.detailValue}>
                    {selectedRapport.type || 
                      <span className={styles.notSpecified}>Non spécifié</span>
                    }
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date du rapport:</span>
                  <span className={styles.detailValue}>
                    {formatDateTime(selectedRapport.date)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Intervention associée:</span>
                  <span className={styles.detailValue}>
                    #{selectedRapport.interventionId}
                  </span>
                </div>
              </div>

              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <div className={styles.detailItem}>
                  <p className={styles.fullDescription}>
                    {selectedRapport.description || 
                      <span className={styles.notSpecified}>Aucune description fournie</span>
                    }
                  </p>
                </div>
              </div>

              {selectedRapport.observation && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>Observations</h3>
                  <div className={styles.detailItem}>
                    <p className={styles.fullDescription}>{selectedRapport.observation}</p>
                  </div>
                </div>
              )}

              {selectedRapport.travaux && (
                <div className={styles.descriptionSection}>
                  <h3 className={styles.sectionTitle}>Travaux effectués</h3>
                  <div className={styles.detailItem}>
                    <p className={styles.fullDescription}>{selectedRapport.travaux}</p>
                  </div>
                </div>
              )}

              <div className={styles.modalActions}>
                <button 
                  className={styles.downloadBtn}
                  onClick={() => {
                    handleDownload(selectedRapport);
                    closeDetailsModal();
                  }}
                >
                  <CIcon icon={cilCloudDownload} />
                  Télécharger le PDF
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => {
                    handleDelete(selectedRapport.id, selectedRapport.client);
                    closeDetailsModal();
                  }}
                >
                  <CIcon icon={cilTrash} />
                  Supprimer le rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rapports;
import React, { useState } from "react";
import { FaTrash, FaDownload, FaFilePdf, FaChartBar } from "react-icons/fa";
import { useRapports } from "../context/RapportContext";
import { useInterventions } from "../context/InterventionContext";
import { toast } from "react-toastify";
import { generateRapportPDF } from "../utils/pdfGenerator";
import styles from "../assets/css/Rapports.module.css";
import "react-toastify/dist/ReactToastify.css";

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

  // Filtrer les rapports
  const filteredRapports = rapports
    .filter(rapport =>
      search === "" ||
      rapport.client?.toLowerCase().includes(search.toLowerCase()) ||
      rapport.intervenant?.toLowerCase().includes(search.toLowerCase()) ||
      rapport.description?.toLowerCase().includes(search.toLowerCase()) ||
      rapport.type?.toLowerCase().includes(search.toLowerCase())
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
    );

  // Pagination
  const totalPages = Math.ceil(filteredRapports.length / rowsPerPage);
  const paginatedRapports = filteredRapports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Statistiques
  const totalRapports = rapports.length;
  const rapportsAvecIntervenant = rapports.filter(r => r.intervenant).length;
  const rapportsCeMois = rapports.filter(r => {
    const rapportDate = new Date(r.date);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return rapportDate.getMonth() === currentMonth && rapportDate.getFullYear() === currentYear;
  }).length;

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
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

  return (
    <div className={styles.container}>
      {/* En-tête */}
      <div className={styles.header}>
        <h1 className={styles.title}>Gestion des Rapports</h1>
        <p className={styles.subtitle}>Consultez et gérez tous vos rapports d'intervention</p>
      </div>

      {/* Statistiques */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <FaFilePdf size={24} />
          <p className={styles.statNumber}>{totalRapports}</p>
          <p className={styles.statLabel}>Rapports Totaux</p>
        </div>
        <div className={styles.statCard}>
          <FaChartBar size={24} />
          <p className={styles.statNumber}>{rapportsAvecIntervenant}</p>
          <p className={styles.statLabel}>Avec Intervenant</p>
        </div>
        <div className={styles.statCard}>
          <FaChartBar size={24} />
          <p className={styles.statNumber}>{rapportsCeMois}</p>
          <p className={styles.statLabel}>Ce Mois</p>
        </div>
      </div>

      {/* Filtres */}
      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Rechercher par client, intervenant, description..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className={styles.inputFilter}
          />
          <input
            type="text"
            placeholder="Filtrer par client..."
            value={clientFilter}
            onChange={e => { setClientFilter(e.target.value); setCurrentPage(1); }}
            className={styles.inputFilter}
          />
          <input
            type="date"
            value={startDate}
            onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
            className={styles.inputFilter}
            placeholder="Date de début"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
            className={styles.inputFilter}
            placeholder="Date de fin"
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className={styles.content}>
        {/* Tableau des rapports */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>ID</th>
                <th>Description</th>
                <th>Client</th>
                <th>Intervenant</th>
                <th>Date</th>
                <th>Intervention ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRapports.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📊</div>
                    <h3 className={styles.emptyTitle}>Aucun rapport trouvé</h3>
                    <p className={styles.emptyText}>
                      {rapports.length === 0 
                        ? "Aucun rapport n'a été généré pour le moment." 
                        : "Aucun rapport ne correspond aux critères de recherche."
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedRapports.map((rapport, index) => (
                  <tr key={rapport.id}>
                    <td className={styles.idColumn}>
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td>{rapport.description || "Aucune description"}</td>
                    <td className={styles.clientColumn}>{rapport.client}</td>
                    <td className={styles.intervenantColumn}>
                      {rapport.intervenant || "Non spécifié"}
                    </td>
                    <td className={styles.dateColumn}>
                      {rapport.date ? new Date(rapport.date).toLocaleDateString('fr-FR') : "Non définie"}
                    </td>
                    <td>
                      <span className={styles.interventionIdColumn}>
                        #{rapport.interventionId}
                      </span>
                    </td>
                    <td className={styles.actionsColumn}>
                      <div className={styles.actionsContainer}>
                        <button
                          className={`${styles.btn} ${styles.btnSuccess}`}
                          onClick={() => handleDownload(rapport)}
                          title="Télécharger PDF"
                        >
                          <FaDownload className={styles.btnIcon} />
                          PDF
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger}`}
                          onClick={() => handleDelete(rapport.id)}
                          title="Supprimer"
                        >
                          <FaTrash className={styles.btnIcon} />
                          Suppr
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
        )}
      </div>
    </div>
  );
}

export default Rapports;
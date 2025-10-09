import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useInterventions } from "../context/InterventionContext";
import styles from "../assets/css/Interventions.module.css";
import { Offcanvas } from "react-bootstrap";
import { generateRapportPDF } from "../utils/pdfGenerator";
import { useRapports } from "../context/RapportContext";
import { toast } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";

function Interventions() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const {
    interventions,
    startIntervention,
    finishIntervention,
    deleteIntervention,
  } = useInterventions();
  const { addRapport } = useRapports();

  // États pour la pagination et filtres
  const [activeTab, setActiveTab] = useState("enattente");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [rapport, setRapport] = useState({
    date: "",
    client: "",
    intervenant: "",
    type: "",
    description: "",
    observation: "",
    travaux: "",
  });

  // 🔎 Filtrage corrigé
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
        const dateField = activeTab === "encours" ? i.date_demarre : i.date_demarre || i.date_survenu;
        return dateField >= startDate && dateField <= endDate;
      }
      return true;
    });

  // Pagination corrigée - utiliser filteredInterventions
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
    setRapport({
      date: new Date().toISOString().slice(0, 16),
      client: intervention.client || "",
      intervenant: "",
      type: "",
      description: intervention.description || "",
      observation: "",
      travaux: "",
    });
    setShowOffcanvas(true);
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

  const handleDownloadRapport = () => {
    if (!rapport.client || !selectedIntervention) {
      alert("Veuillez remplir le rapport avant de générer le PDF.");
      return;
    }
    generateRapportPDF(rapport, selectedIntervention);
  };

  const handleFinishIntervention = (intervention) => {
    finishIntervention(intervention.id);
    addNotification(`Intervention #${intervention.id} terminée ✅`);
    toast.success(`✅ Intervention #${intervention.id} terminée !`);
  };

  // Fonction pour obtenir les interventions à afficher selon l'onglet
  const getInterventionsToDisplay = () => {
    return paginatedInterventions;
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

  return (
    <div className={styles.container}>
      {/* Onglets */}
      <ul className={styles.tabs}>
        <li className={styles.tabItem}>
          <button
            className={`${styles.tabLink} ${activeTab === "enattente" ? styles.active : ""}`}
            onClick={() => { setActiveTab("enattente"); setCurrentPage(1); }}
          >
            En attente ({interventionsEnAttente.length})
          </button>
        </li>
        <li className={styles.tabItem}>
          <button
            className={`${styles.tabLink} ${activeTab === "encours" ? styles.active : ""}`}
            onClick={() => { setActiveTab("encours"); setCurrentPage(1); }}
          >
            En cours ({interventionsEnCours.length})
          </button>
        </li>
        <li className={styles.tabItem}>
          <button
            className={`${styles.tabLink} ${activeTab === "termine" ? styles.active : ""}`}
            onClick={() => { setActiveTab("termine"); setCurrentPage(1); }}
          >
            Terminé ({interventionsTerminees.length})
          </button>
        </li>
      </ul>

      {/* Filtres */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Recherche..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className={styles.inputFilter}
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className={styles.inputFilter}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className={styles.inputFilter}
        />
      </div>

      <div className={styles.content}>
        {/* EN ATTENTE */}
        {activeTab === "enattente" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Incidents</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getInterventionsToDisplay().length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.textCenter}>
                    Pas d'intervention en attente.
                  </td>
                </tr>
              )}
              {getInterventionsToDisplay().map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.incidentId}</td>
                  <td>{i.client}</td>
                  <td>{i.produit}</td>
                  <td>
                    <span className={getStatusBadgeClass(i.statut)}>{i.statut}</span>
                  </td>
                  <td>
                    <i
                      className={`bi bi-play-circle-fill text-success ${styles.actionIcon}`}
                      title="Démarrer"
                      onClick={() => startIntervention(i.id)}
                    />
                    <i
                      className={`bi bi-trash-fill text-danger ${styles.actionIcon}`}
                      title="Supprimer"
                      onClick={() => deleteIntervention(i.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* EN COURS */}
        {activeTab === "encours" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Incidents</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Démarrée le</th>
                <th>Statut</th>
                <th>Rapport</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getInterventionsToDisplay().length === 0 && (
                <tr>
                  <td colSpan="8" className={styles.textCenter}>
                    Pas d'intervention en cours.
                  </td>
                </tr>
              )}
              {getInterventionsToDisplay().map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.incidentId}</td>
                  <td>{i.client}</td>
                  <td>{i.produit}</td>
                  <td>{formatDateTime(i.startedAt)}</td>
                  <td>
                    <span className={getStatusBadgeClass(i.statut)}>{i.statut}</span>
                  </td>
                  <td>
                    <i
                      className={`bi bi-journal-text text-info ${styles.actionIcon}`}
                      title="Rapport"
                      onClick={() => openReportForm(i)}
                    />
                    <i
                      className={`bi bi-download text-success ${styles.actionIcon}`}
                      title="Télécharger rapport"
                      onClick={() => handleDownloadRapport(i)}
                    />
                  </td>
                  <td>
                    <i
                      className={`bi bi-stop-circle-fill text-success ${styles.actionIcon}`}
                      title="Terminer"
                      onClick={() => handleFinishIntervention(i)}
                    />
                    <i
                      className={`bi bi-trash-fill text-danger ${styles.actionIcon}`}
                      title="Supprimer"
                      onClick={() => deleteIntervention(i.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TERMINE */}
        {activeTab === "termine" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Incidents</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Démarrée le</th>
                <th>Terminée le</th>
                <th>Statut</th>
                <th>Rapport</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getInterventionsToDisplay().length === 0 && (
                <tr>
                  <td colSpan="9" className={styles.textCenter}>
                    Pas d'intervention terminée.
                  </td>
                </tr>
              )}
              {getInterventionsToDisplay().map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.incidentId}</td>
                  <td>{i.client}</td>
                  <td>{i.produit}</td>
                  <td>{formatDateTime(i.startedAt)}</td>
                  <td>{formatDateTime(i.endedAt)}</td>
                  <td>
                    <span className={getStatusBadgeClass(i.statut)}>{i.statut}</span>
                  </td>
                  <td>
                    <i
                      className={`bi bi-journal-text text-info ${styles.actionIcon}`}
                      title="Voir rapport"
                      onClick={() => openReportForm(i)}
                    />
                    <i
                      className={`bi bi-download text-success ${styles.actionIcon}`}
                      title="Télécharger rapport"
                      onClick={() => handleDownloadRapport(i)}
                    />
                  </td>
                  <td>
                    <i
                      className={`bi bi-trash-fill text-danger ${styles.actionIcon}`}
                      title="Supprimer"
                      onClick={() => deleteIntervention(i.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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

      {/* Offcanvas */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title className={styles.offcanvasTitle}>
            Rapport d'intervention
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.offcanvasBody}>
          <form>
            <div className={styles.mb3}>
              <label>Date</label>
              <input
                type="datetime-local"
                className={styles.formControl}
                value={rapport.date}
                onChange={(e) => setRapport({ ...rapport, date: e.target.value })}
              />
            </div>
            <div className={styles.mb3}>
              <label>Client</label>
              <input
                type="text"
                className={styles.formControl}
                value={rapport.client}
                onChange={(e) => setRapport({ ...rapport, client: e.target.value })}
              />
            </div>
            <div className={styles.mb3}>
              <label>Intervenant</label>
              <input
                type="text"
                className={styles.formControl}
                value={rapport.intervenant}
                onChange={(e) => setRapport({ ...rapport, intervenant: e.target.value })}
              />
            </div>
            <div className={styles.mb3}>
              <label>Type Intervention</label>
              <input
                type="text"
                className={styles.formControl}
                value={rapport.type}
                onChange={(e) => setRapport({ ...rapport, type: e.target.value })}
              />
            </div>
            <div className={styles.mb3}>
              <label>Description</label>
              <textarea
                className={styles.formControl}
                value={rapport.description}
                onChange={(e) => setRapport({ ...rapport, description: e.target.value })}
              />
            </div>
            <div className={styles.mb3}>
              <label>Observation</label>
              <textarea
                className={styles.formControl}
                value={rapport.observation}
                onChange={(e) => setRapport({ ...rapport, observation: e.target.value })}
              />
            </div>
            <div className={styles.mb3}>
              <label>Travaux effectués</label>
              <textarea
                className={styles.formControl}
                value={rapport.travaux}
                onChange={(e) => setRapport({ ...rapport, travaux: e.target.value })}
              />
            </div>
            <button 
              type="button" 
              className={`btn btn-success ${styles.w100}`} 
              onClick={handleSaveRapport}
            >
              Générer le rapport
            </button>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Interventions;
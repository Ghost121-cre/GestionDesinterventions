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
  const { addRapport, rapports } = useRapports();

  // DEBUG
  console.log("Interventions:", interventions);

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

  const handleDownloadRapport = (intervention) => {
    const rapportExistant = getRapportForIntervention(intervention.id);
    
    if (!rapportExistant) {
      toast.error("⚠️ Vous devez d'abord générer le rapport avant de pouvoir le télécharger.");
      return;
    }

    generateRapportPDF(rapportExistant, intervention);
    toast.success("📄 Rapport téléchargé avec succès !");
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

  // Fonction pour afficher le message quand le tableau est vide
  const renderEmptyMessage = (colSpan) => (
    <tr>
      <td colSpan={colSpan} className={styles.emptyCell}>
        <div className={styles.emptyMessage}>
          <i className="bi bi-inbox" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
          Pas d'intervention {activeTab === "enattente" ? "en attente" : activeTab === "encours" ? "en cours" : "terminée"}.
        </div>
      </td>
    </tr>
  );

  // Fonction pour afficher l'icône de téléchargement avec vérification
  const renderDownloadIcon = (intervention) => {
    const hasRapportForThis = hasRapport(intervention.id);
    
    return (
      <i
        className={`bi bi-download ${hasRapportForThis ? 'text-success' : 'text-muted'} ${styles.actionIcon}`}
        title={hasRapportForThis ? "Télécharger rapport" : "Vous devez d'abord générer le rapport"}
        onClick={() => hasRapportForThis ? handleDownloadRapport(intervention) : toast.error("⚠️ Vous devez d'abord générer le rapport")}
        style={{ cursor: hasRapportForThis ? 'pointer' : 'not-allowed', opacity: hasRapportForThis ? 1 : 0.5 }}
      />
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
            </div>
          );
        })}
      </div>
    );
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
              {paginatedInterventions.length === 0 
                ? renderEmptyMessage(6)
                : paginatedInterventions.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.incidentId || '-'}</td>
                    <td>{i.client}</td>
                    <td>{i.produit}</td>
                    <td>
                      <span className={getStatusBadgeClass(i.statut)}>{i.statut}</span>
                    </td>
                    <td>
                      <button 
                        className={styles.detailsBtn}
                        onClick={() => openDetailsModal(i)}
                        title="Voir les détails"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
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
                ))
              }
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
              {paginatedInterventions.length === 0 
                ? renderEmptyMessage(8)
                : paginatedInterventions.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.incidentId || '-'}</td>
                    <td>{i.client}</td>
                    <td>{i.produit}</td>
                    <td>{formatDateTime(i.startedAt)}</td>
                    <td>
                      <span className={getStatusBadgeClass(i.statut)}>{i.statut}</span>
                    </td>
                    <td>
                      <i
                        className={`bi bi-journal-text text-info ${styles.actionIcon}`}
                        title="Générer rapport"
                        onClick={() => openReportForm(i)}
                      />
                      {renderDownloadIcon(i)}
                    </td>
                    <td>
                      <button 
                        className={styles.detailsBtn}
                        onClick={() => openDetailsModal(i)}
                        title="Voir les détails"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
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
                ))
              }
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
              {paginatedInterventions.length === 0 
                ? renderEmptyMessage(9)
                : paginatedInterventions.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.incidentId || '-'}</td>
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
                        title="Voir/modifier rapport"
                        onClick={() => openReportForm(i)}
                      />
                      {renderDownloadIcon(i)}
                    </td>
                    <td>
                      <button 
                        className={styles.detailsBtn}
                        onClick={() => openDetailsModal(i)}
                        title="Voir les détails"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <i
                        className={`bi bi-trash-fill text-danger ${styles.actionIcon}`}
                        title="Supprimer"
                        onClick={() => deleteIntervention(i.id)}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
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

      {/* Modale de détails */}
      {showDetailsModal && selectedInterventionDetails && (
        <div className={styles.modalOverlay} onClick={closeDetailsModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Détails de l'intervention #{selectedInterventionDetails.id}
              </h2>
              <button className={styles.modalClose} onClick={closeDetailsModal}>
                ✕
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
                      {selectedInterventionDetails.statut}
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
                  <span className={styles.detailValue}>
                    {selectedInterventionDetails.description || 'Aucune description'}
                  </span>
                </div>
              </div>

              {/* Images */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Images ({selectedInterventionDetails.images?.length || 0})</h3>
                {renderImages(selectedInterventionDetails.images)}
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
              ✕
            </button>
            <img 
              src={lightboxImage.src} 
              alt="Détail" 
              className={styles.lightboxImage}
            />
          </div>
        </div>
      )}

      {/* Offcanvas Rapport d'intervention */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        style={{ width: "600px" }}
      >
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title className={styles.offcanvasTitle}>
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
              <input
                type="text"
                className="form-control"
                value={rapport.intervenant}
                onChange={(e) => setRapport({ ...rapport, intervenant: e.target.value })}
                placeholder="Nom de l'intervenant"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Type d'intervention</label>
              <input
                type="text"
                className="form-control"
                value={rapport.type}
                onChange={(e) => setRapport({ ...rapport, type: e.target.value })}
                placeholder="Type d'intervention"
              />
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
                <i className="bi bi-check-circle me-2"></i>
                Enregistrer le rapport
              </button>
              
              {hasRapport(selectedIntervention?.id) && (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => handleDownloadRapport(selectedIntervention)}
                >
                  <i className="bi bi-download me-2"></i>
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
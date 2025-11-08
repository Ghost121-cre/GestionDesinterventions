import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInterventions } from "../context/InterventionContext";
import styles from "../assets/css/Interventions.module.css";
import { Offcanvas } from "react-bootstrap";
import { generateRapportPDF } from "../utils/pdfGenerator";
import { useRapports } from "../context/RapportContext";
import { toast } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";
import CIcon from "@coreui/icons-react";
import { userService } from "../services/apiService";

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
  cilWarning,
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
  const [techniciens, setTechniciens] = useState([]);
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
  const [errors, setErrors] = useState({});

  // États pour la modale de détails
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInterventionDetails, setSelectedInterventionDetails] =
    useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  const [rapport, setRapport] = useState({
    dateRapport: new Date().toISOString().slice(0, 10),
    heureDebut: "",
    heureFin: "",
    client: selectedIntervention?.client?.nom || "",
    intervenant: [],
    typeIntervention: "",
    description: selectedIntervention?.description || "",
    observation: "",
    travauxEffectues: "",
  });

  // Charger les techniciens depuis l'API
  useEffect(() => {
    const loadTechniciens = async () => {
      try {
        console.log("🔄 Chargement des techniciens...");
        const users = await userService.getUsers();

        const techniciensTrouves = users.filter(
          (user) => user.role && user.role.toLowerCase() === "technicien"
        );

        console.log("👨‍💼 Techniciens trouvés:", techniciensTrouves);
        setTechniciens(techniciensTrouves);
      } catch (error) {
        console.error("❌ Erreur chargement techniciens:", error);
        toast.error("Erreur lors du chargement des techniciens");
      }
    };

    loadTechniciens();
  }, []);

  const getImageUrls = (images) => {
    if (!images || images.length === 0) return [];

    return images
      .map((img) => {
        if (typeof img === "string" && img.startsWith("http")) {
          return img;
        }

        if (typeof img === "string") {
          return `http://localhost:5275${img}`;
        }

        if (img && typeof img === "object") {
          if (img.chemin) {
            return img.chemin.startsWith("http")
              ? img.chemin
              : `http://localhost:5275${img.chemin}`;
          } else if (img.url) {
            return img.url.startsWith("http")
              ? img.url
              : `http://localhost:5275${img.url}`;
          } else if (img.nomFichier) {
            console.log("Image utilisée :", img.nomFichier);

            return `http://localhost:5275/uploads/interventions/${img.nomFichier}`;
          }
        }

        console.warn("Format image non reconnu:", img);
        return "";
      })
      .filter((url) => url !== "");
  };

  // Vérifier si un rapport existe pour une intervention
  const hasRapport = (interventionId) => {
    return rapports.some(
      (rapport) => rapport.interventionId === interventionId
    );
  };

  // Obtenir le rapport pour une intervention
  const getRapportForIntervention = (interventionId) => {
    return rapports.find(
      (rapport) => rapport.interventionId === interventionId
    );
  };

  // Télécharger le rapport PDF
  const handleDownloadRapport = async (intervention) => {
    const rapportExistant = getRapportForIntervention(intervention.id);

    if (!rapportExistant) {
      toast.error(
        "⚠️ Vous devez d'abord générer le rapport avant de pouvoir le télécharger."
      );
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
    .filter((i) => {
      switch (activeTab) {
        case "enattente":
          return i.statut === "En attente";
        case "encours":
          return i.statut === "En cours";
        case "termine":
          return i.statut === "Terminé";
        default:
          return true;
      }
    })
    .filter(
      (i) =>
        search === "" ||
        i.client?.nom?.toLowerCase().includes(search.toLowerCase()) ||
        i.produit?.nom?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((i) => {
      if (startDate && endDate) {
        const dateField =
          activeTab === "encours"
            ? i.date_demarre
            : i.date_demarre || i.datetime;
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
  const interventionsEnAttente = interventions.filter(
    (i) => i.statut === "En attente"
  );
  const interventionsEnCours = interventions.filter(
    (i) => i.statut === "En cours"
  );
  const interventionsTerminees = interventions.filter(
    (i) => i.statut === "Terminé"
  );

  // Format date
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
      // Si un rapport existe, assurez-vous que intervenants est un tableau
      setRapport({
        ...rapportExistant,
        intervenant: Array.isArray(rapportExistant.intervenant)
          ? rapportExistant.intervenant
          : rapportExistant.intervenant
          ? [rapportExistant.intervenant]
          : [],
      });
    } else {
      setRapport({
        dateRapport: new Date().toISOString().slice(0, 10),
        heureDebut: "",
        heureFin: "",
        client: intervention.client?.nom || "",
        intervenant: [], // ← CORRECT
        typeIntervention: "",
        description: intervention.description || "",
        observation: "",
        travauxEffectues: "",
      });
    }
    setErrors({});
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

  const validateForm = () => {
    const newErrors = {};
    if (!rapport.intervenant || rapport.intervenant.length === 0)
      newErrors.intervenant = "Au moins un intervenant est obligatoire";
    if (!rapport.typeIntervention)
      newErrors.typeIntervention = "Le type d'intervention est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Obtenir tous les rapports pour une intervention
  const getRapportsForIntervention = (interventionId) => {
    return rapports.filter(
      (rapport) => rapport.interventionId === interventionId
    );
  };

  const handleSaveRapport = () => {
    if (!selectedIntervention) {
      toast.error("Aucune intervention sélectionnée");
      return;
    }

    if (!validateForm()) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    const newRapport = {
      id: Date.now(),
      dateRapport: rapport.dateRapport,
      heureDebut: rapport.heureDebut,
      heureFin: rapport.heureFin,
      client: rapport.client,
      intervenant: rapport.intervenant,
      typeIntervention: rapport.typeIntervention,
      description: rapport.description,
      observation: rapport.observation,
      travauxEffectues: rapport.travauxEffectues,
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
    switch (statut) {
      case "En cours":
        return `${styles.statusBadge} ${styles.statusEnCours}`;
      case "Terminé":
        return `${styles.statusBadge} ${styles.statusTermine}`;
      case "En attente":
        return `${styles.statusBadge} ${styles.statusEnAttente}`;
      default:
        return styles.statusBadge;
    }
  };

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (statut) => {
    switch (statut) {
      case "En cours":
        return cilArrowRight;
      case "Terminé":
        return cilCheckCircle;
      case "En attente":
        return cilClock;
      default:
        return cilClock;
    }
  };

  // Fonction pour afficher le message quand le tableau est vide
  const renderEmptyMessage = (colSpan) => (
    <tr>
      <td colSpan={colSpan} className={styles.emptyCell}>
        <div className={styles.emptyMessage}>
          <CIcon icon={cilClock} size="3xl" className={styles.emptyIcon} />
          <div className={styles.emptyText}>
            Pas d'intervention{" "}
            {activeTab === "enattente"
              ? "en attente"
              : activeTab === "encours"
              ? "en cours"
              : "terminée"}
            .
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
        className={`${styles.actionBtn} ${
          hasRapportForThis ? styles.downloadBtn : styles.disabledBtn
        }`}
        title={
          hasRapportForThis
            ? "Télécharger rapport"
            : "Vous devez d'abord générer le rapport"
        }
        onClick={() =>
          hasRapportForThis
            ? handleDownloadRapport(intervention)
            : toast.error("⚠️ Vous devez d'abord générer le rapport")
        }
        disabled={!hasRapportForThis}
      >
        <CIcon icon={cilCloudDownload} />
      </button>
    );
  };

  // Dans renderImages, remplacez par :
  const renderImages = (images) => {
    if (!images || images.length === 0) {
      return <div className={styles.noImages}>Aucune image disponible</div>;
    }

    const imageUrls = getImageUrls(images);
    console.log("🖼️ URLs images générées:", imageUrls);

    return (
      <div className={styles.imagesContainer}>
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className={styles.imageItem}>
            <img
              src={imageUrl}
              alt={`Intervention ${index + 1}`}
              className={styles.detailImage}
              onClick={() => setLightboxImage({ src: imageUrl, index })}
              onError={(e) => {
                console.error(`❌ Erreur chargement image ${index}:`, imageUrl);
                e.target.style.display = "none";
              }}
              onLoad={() => console.log(`✅ Image ${index} chargée:`, imageUrl)}
            />
            <div className={styles.imageNumber}>{index + 1}</div>
          </div>
        ))}
      </div>
    );
  };
  // Navigation lightbox
  const prevImage = () => {
    if (!lightboxImage) return;
    const totalImages = allImages.length;
    setLightboxImage((prev) => ({
      ...prev,
      index: prev.index === 0 ? totalImages - 1 : prev.index - 1,
    }));
  };

  const nextImage = () => {
    if (!lightboxImage) return;
    const totalImages = allImages.length;
    setLightboxImage((prev) => ({
      ...prev,
      index: prev.index === totalImages - 1 ? 0 : prev.index + 1,
    }));
  };

  const toggleZoom = () => setZoomed((prev) => !prev);

  // Obtenir la couleur de priorité
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "low":
        return "Basse";
      case "medium":
        return "Moyenne";
      case "high":
        return "Haute";
      default:
        return "Non définie";
    }
  };

  // Statistiques
  const stats = {
    total: interventions.length,
    enAttente: interventionsEnAttente.length,
    enCours: interventionsEnCours.length,
    terminees: interventionsTerminees.length,
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
            className={`${styles.tab} ${
              activeTab === "enattente" ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab("enattente");
              setCurrentPage(1);
            }}
          >
            <CIcon icon={cilClock} className={styles.tabIcon} />
            En attente
            <span className={styles.tabBadge}>
              {interventionsEnAttente.length}
            </span>
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "encours" ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab("encours");
              setCurrentPage(1);
            }}
          >
            <CIcon icon={cilArrowRight} className={styles.tabIcon} />
            En cours
            <span className={styles.tabBadge}>
              {interventionsEnCours.length}
            </span>
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "termine" ? styles.tabActive : ""
            }`}
            onClick={() => {
              setActiveTab("termine");
              setCurrentPage(1);
            }}
          >
            <CIcon icon={cilCheckCircle} className={styles.tabIcon} />
            Terminé
            <span className={styles.tabBadge}>
              {interventionsTerminees.length}
            </span>
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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.dateFilters}>
          <div className={styles.dateGroup}>
            <CIcon icon={cilCalendar} className={styles.filterIcon} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
              placeholder="Date début"
            />
          </div>
          <span className={styles.dateSeparator}>à</span>
          <div className={styles.dateGroup}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
                          {i.incidentId ? `#${i.incidentId}` : "-"}
                        </td>
                        <td className={styles.clientCell}>
                          {i.client?.nom || `Client #${i.clientId}`}
                        </td>
                        <td className={styles.productCell}>
                          {i.produit?.nom || `Produit #${i.produitId}`}
                        </td>
                        <td className={styles.priorityCell}>
                          <span
                            className={styles.priorityBadge}
                            style={{
                              backgroundColor: `${getPriorityColor(
                                i.priorite
                              )}20`,
                              color: getPriorityColor(i.priorite),
                              borderColor: getPriorityColor(i.priorite),
                            }}
                          >
                            {getPriorityLabel(i.priorite)}
                          </span>
                        </td>
                        <td className={styles.statusCell}>
                          <span className={getStatusBadgeClass(i.statut)}>
                            <CIcon
                              icon={getStatusIcon(i.statut)}
                              className={styles.statusIcon}
                            />
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
                                if (
                                  window.confirm(
                                    `Supprimer l'intervention #${i.id} ?`
                                  )
                                ) {
                                  deleteIntervention(i.id);
                                  toast.success(
                                    `🗑️ Intervention #${i.id} supprimée !`
                                  );
                                }
                              }}
                              title="Supprimer"
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                          {i.incidentId ? `#${i.incidentId}` : "-"}
                        </td>
                        <td className={styles.clientCell}>
                          {i.client?.nom || `Client #${i.clientId}`}
                        </td>
                        <td className={styles.productCell}>
                          {i.produit?.nom || `Produit #${i.produitId}`}
                        </td>
                        <td className={styles.dateCell}>
                          {formatDateTime(
                            i.startedAt || i.date_demarre || i.dateDebut
                          )}
                        </td>
                        <td className={styles.priorityCell}>
                          <span
                            className={styles.priorityBadge}
                            style={{
                              backgroundColor: `${getPriorityColor(
                                i.priorite
                              )}20`,
                              color: getPriorityColor(i.priorite),
                              borderColor: getPriorityColor(i.priorite),
                            }}
                          >
                            {getPriorityLabel(i.priorite)}
                          </span>
                        </td>
                        <td className={styles.statusCell}>
                          <span className={getStatusBadgeClass(i.statut)}>
                            <CIcon
                              icon={getStatusIcon(i.statut)}
                              className={styles.statusIcon}
                            />
                            {i.statut}
                          </span>
                        </td>
                        <td className={styles.reportCell}>
                          <div className={styles.reportActions}>
                            <button
                              className={styles.reportBtn}
                              onClick={() => openReportForm(i)}
                              title="Générer un nouveau rapport"
                            >
                              <CIcon icon={cilFile} />
                            </button>
                            {hasRapport(i.id) && (
                              <span className={styles.rapportCount}>
                                {getRapportsForIntervention(i.id).length}
                              </span>
                            )}
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
                                if (
                                  window.confirm(
                                    `Supprimer l'intervention #${i.id} ?`
                                  )
                                ) {
                                  deleteIntervention(i.id);
                                  toast.success(
                                    `🗑️ Intervention #${i.id} supprimée !`
                                  );
                                }
                              }}
                              title="Supprimer"
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                          {i.incidentId ? `#${i.incidentId}` : "-"}
                        </td>
                        <td className={styles.clientCell}>
                          {i.client?.nom || `Client #${i.clientId}`}
                        </td>
                        <td className={styles.productCell}>
                          {i.produit?.nom || `Produit #${i.produitId}`}
                        </td>
                        <td className={styles.dateCell}>
                          {formatDateTime(
                            i.startedAt || i.date_demarre || i.dateDebut
                          )}
                        </td>
                        <td className={styles.dateCell}>
                          {formatDateTime(i.endedAt || i.date_fin || i.dateFin)}
                        </td>
                        <td className={styles.priorityCell}>
                          <span
                            className={styles.priorityBadge}
                            style={{
                              backgroundColor: `${getPriorityColor(
                                i.priorite
                              )}20`,
                              color: getPriorityColor(i.priorite),
                              borderColor: getPriorityColor(i.priorite),
                            }}
                          >
                            {getPriorityLabel(i.priorite)}
                          </span>
                        </td>
                        <td className={styles.statusCell}>
                          <span className={getStatusBadgeClass(i.statut)}>
                            <CIcon
                              icon={getStatusIcon(i.statut)}
                              className={styles.statusIcon}
                            />
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
                                if (
                                  window.confirm(
                                    `Supprimer l'intervention #${i.id} ?`
                                  )
                                ) {
                                  deleteIntervention(i.id);
                                  toast.success(
                                    `🗑️ Intervention #${i.id} supprimée !`
                                  );
                                }
                              }}
                              title="Supprimer"
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <CIcon icon={cilChevronLeft} />
            Précédent
          </button>

          <div className={styles.paginationNumbers}>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                className={`${styles.pageBtn} ${
                  currentPage === idx + 1 ? styles.activePage : ""
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            className={styles.paginationBtn}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <CIcon
                  icon={getStatusIcon(selectedInterventionDetails.statut)}
                  className={styles.modalTitleIcon}
                />
                Détails de l'intervention #{selectedInterventionDetails.id}
              </h2>
              <button className={styles.modalClose} onClick={closeDetailsModal}>
                <CIcon icon={cilX} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Informations principales */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>
                  Informations principales
                </h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Client:</span>
                    <span className={styles.detailValue}>
                      {selectedInterventionDetails.client?.nom ||
                        `Client #${selectedInterventionDetails.clientId}`}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Produit:</span>
                    <span className={styles.detailValue}>
                      {selectedInterventionDetails.produit?.nom ||
                        `Produit #${selectedInterventionDetails.produitId}`}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Statut:</span>
                    <span
                      className={getStatusBadgeClass(
                        selectedInterventionDetails.statut
                      )}
                    >
                      <CIcon
                        icon={getStatusIcon(selectedInterventionDetails.statut)}
                        className={styles.statusIcon}
                      />
                      {selectedInterventionDetails.statut}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Priorité:</span>
                    <span
                      className={styles.detailValue}
                      style={{
                        color: getPriorityColor(
                          selectedInterventionDetails.priorite
                        ),
                      }}
                    >
                      {getPriorityLabel(selectedInterventionDetails.priorite)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      Incident associé:
                    </span>
                    <span className={styles.detailValue}>
                      {selectedInterventionDetails.incidentId
                        ? `#${selectedInterventionDetails.incidentId}`
                        : "Aucun"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Dates et technicien */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Planification</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailValue}>
                      {formatDateTime(
                        selectedInterventionDetails.datetime ||
                          selectedInterventionDetails.datePlanifiee ||
                          selectedInterventionDetails.date_planifiee
                      )}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Technicien:</span>
                    <span className={styles.detailValue}>
                      {selectedInterventionDetails.technicien?.prenom &&
                      selectedInterventionDetails.technicien?.nom
                        ? `${selectedInterventionDetails.technicien.prenom} ${selectedInterventionDetails.technicien.nom}`
                        : selectedInterventionDetails.technicienId
                        ? `Technicien #${selectedInterventionDetails.technicienId}`
                        : "Non assigné"}
                    </span>
                  </div>
                  {selectedInterventionDetails.startedAt && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Démarrée le:</span>
                      <span className={styles.detailValue}>
                        {formatDateTime(selectedInterventionDetails.startedAt)}
                      </span>
                    </div>
                  )}
                  {selectedInterventionDetails.endedAt && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Terminée le:</span>
                      <span className={styles.detailValue}>
                        {formatDateTime(selectedInterventionDetails.endedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Description */}
              <div className={styles.detailSection}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <div className={styles.detailItem}>
                  <p className={styles.detailDescription}>
                    {selectedInterventionDetails.description ||
                      "Aucune description"}
                  </p>
                </div>
              </div>
              {/* Section Images - Version SIMPLIFIÉE comme pour les incidents */}
              {selectedInterventionDetails?.images &&
                selectedInterventionDetails.images.length > 0 && (
                  <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>
                      Images ({selectedInterventionDetails.images.length})
                    </h3>
                    <div className={styles.modalImages}>
                      {getImageUrls(selectedInterventionDetails.images).map(
                        (src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt={`Intervention ${
                              selectedInterventionDetails.id
                            } - ${idx + 1}`}
                            className={styles.modalImage}
                            onClick={() =>
                              setLightboxImage({ src, index: idx })
                            }
                            onError={(e) => {
                              console.error(
                                `❌ Erreur chargement image ${idx}:`,
                                src
                              );
                              e.target.style.display = "none";
                            }}
                            onLoad={() =>
                              console.log(`✅ Image ${idx} chargée:`, src)
                            }
                          />
                        )
                      )}
                    </div>
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
                      toast.success(
                        `🚀 Intervention #${selectedInterventionDetails.id} démarrée !`
                      );
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
                    {hasRapport(selectedInterventionDetails.id)
                      ? "Modifier le rapport"
                      : "Créer un rapport"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox pour images */}
      {lightboxImage && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxImage(null)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
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
                className={`${styles.lightboxImage} ${
                  zoomed ? styles.zoomed : ""
                }`}
                onClick={toggleZoom}
              />
              <button className={styles.zoomHint} onClick={toggleZoom}>
                <CIcon icon={cilZoom} />
                {zoomed ? "Dézoomer" : "Zoomer"}
              </button>
            </div>

            {allImages.length > 1 && (
              <>
                <button
                  className={styles.lightboxNav}
                  onClick={prevImage}
                  title="Image précédente"
                >
                  <CIcon icon={cilChevronLeft} />
                </button>
                <button
                  className={styles.lightboxNav}
                  onClick={nextImage}
                  title="Image suivante"
                >
                  <CIcon icon={cilChevronRight} />
                </button>
                <div className={styles.lightboxCounter}>
                  {lightboxImage.index + 1} / {allImages.length}
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
            Rapport d'intervention{" "}
            {selectedIntervention ? `#${selectedIntervention.id}` : ""}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.offcanvasBody}>
          <form>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={rapport.date}
                onChange={(e) =>
                  setRapport({ ...rapport, dateRapport: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Heure de début</label>
              <input
                type="time"
                className="form-control"
                value={rapport.heureDebut}
                onChange={(e) =>
                  setRapport({ ...rapport, heureDebut: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Heure de fin</label>
              <input
                type="time"
                className="form-control"
                value={rapport.heureFin}
                onChange={(e) =>
                  setRapport({ ...rapport, heureFin: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Client</label>
              <input
                type="text"
                className="form-control"
                value={rapport.client}
                onChange={(e) =>
                  setRapport({ ...rapport, client: e.target.value })
                }
                placeholder="Nom du client"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Intervenant(s) *</label>
              <select
                className={`form-select ${
                  errors.intervenant ? "is-invalid" : ""
                }`}
                value={rapport.intervenant} // ← Maintenant un tableau
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setRapport({ ...rapport, intervenant: selectedOptions });
                  setErrors({ ...errors, intervenant: "" });
                }}
                multiple // ← Ajoutez multiple
                size="4" // ← Taille visible du select
                required
              >
                <option value="">
                  -- Sélectionner un ou plusieurs intervenants --
                </option>
                {techniciens.map((tech) => (
                  <option key={tech.id} value={`${tech.prenom} ${tech.nom}`}>
                    {tech.prenom} {tech.nom} - {tech.matricule || tech.email}
                  </option>
                ))}
              </select>
              <small className="form-text text-muted">
                Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs
                intervenants
              </small>
              {errors.intervenant && (
                <div className="invalid-feedback">{errors.intervenant}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Type d'intervention *</label>
              <select
                className={`form-select ${
                  errors.typeIntervention ? "is-invalid" : ""
                }`}
                value={rapport.typeIntervention}
                onChange={(e) => {
                  setRapport({ ...rapport, typeIntervention: e.target.value });
                  setErrors({ ...errors, typeIntervention: "" });
                }}
                required
              >
                <option value="">
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
                onChange={(e) =>
                  setRapport({ ...rapport, description: e.target.value })
                }
                placeholder="Description de l'intervention"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Observations</label>
              <textarea
                className="form-control"
                rows="3"
                value={rapport.observation}
                onChange={(e) =>
                  setRapport({ ...rapport, observation: e.target.value })
                }
                placeholder="Observations sur l'intervention"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Travaux effectués</label>
              <textarea
                className="form-control"
                rows="3"
                value={rapport.travaux}
                onChange={(e) =>
                  setRapport({ ...rapport, travauxEffectues: e.target.value })
                }
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
                <div className="mb-3">
                  <label className="form-label">Rapports existants</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      const rapportId = e.target.value;
                      if (rapportId) {
                        const rapportSelectionne = rapports.find(
                          (r) => r.id === parseInt(rapportId)
                        );
                        if (rapportSelectionne) {
                          handleDownloadRapport(
                            selectedIntervention,
                            rapportSelectionne
                          );
                        }
                      }
                    }}
                  >
                    <option value="">
                      -- Sélectionner un rapport à télécharger --
                    </option>
                    {getRapportsForIntervention(selectedIntervention.id)
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt || b.id) -
                          new Date(a.createdAt || a.id)
                      )
                      .map((rapport) => (
                        <option key={rapport.id} value={rapport.id}>
                          Rapport du{" "}
                          {new Date(
                            rapport.dateRapport ||
                              rapport.createdAt ||
                              rapport.id
                          ).toLocaleDateString("fr-FR")}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Interventions;

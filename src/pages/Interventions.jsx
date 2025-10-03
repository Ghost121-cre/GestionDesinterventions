import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterventions } from "../context/InterventionContext";
import "../assets/css/Interventions.css";
import { Offcanvas } from "react-bootstrap";
import { generateRapportPDF } from "../utils/pdfGenerator";
import { useRapports } from "../context/RapportContext";
import { useContext } from "react"
import { toast } from "react-toastify"
import { NotificationContext } from "../context/NotificationContext"

function Interventions() {
  const { addNotification } = useContext(NotificationContext)

  const navigate = useNavigate();
  const {
    interventions,
    startIntervention,
    finishIntervention,
    deleteIntervention,
  } = useInterventions();

  const [activeTab, setActiveTab] = useState("enattente");
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [rapport, setRapport] = useState({
    date: "",
    client: "",
    intervenant: "",
    type: "",
    description: "",
    observation: "",
    travaux: "",
  });

  const { addRapport } = useRapports();
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

  // Ajouter dans un état ou context global pour centraliser tous les rapports
  addRapport(newRapport);

  setShowOffcanvas(false);
  toast.success("✅ Rapport enregistré !");
};



  // Filtrer interventions par statut
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

  // const handleSaveRapport = () => {
  //   console.log("Rapport :", { intervention: selectedIntervention, ...rapport });
  //   setShowOffcanvas(false);
  //   alert("Rapport enregistré !");
  // };

  const handleDownloadRapport = () => {
    if (!rapport.client || !selectedIntervention) {
      alert("Veuillez remplir le rapport avant de générer le PDF.");
      return;
    }
    generateRapportPDF(rapport, selectedIntervention);
  };

  const handleFinishIntervention = (intervention) => {
  // Met à jour le statut de l'intervention
  finishIntervention(intervention.id);

  // Ajouter une notification globale
  addNotification(`Intervention #${intervention.id} terminée ✅`);

  // Afficher un toast
  toast.success(`✅ Intervention #${intervention.id} terminée !`);
};


  return (
    <div className="intervention-container">
      {/* Onglets */}
      <ul className="nav nav-tabs custom-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "enattente" ? "active" : ""}`}
            onClick={() => setActiveTab("enattente")}
          >
            En attente ({interventionsEnAttente.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "encours" ? "active" : ""}`}
            onClick={() => setActiveTab("encours")}
          >
            En cours ({interventionsEnCours.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "termine" ? "active" : ""}`}
            onClick={() => setActiveTab("termine")}
          >
            Terminé ({interventionsTerminees.length})
          </button>
        </li>
      </ul>

      <div className="tab-content custom-content">
        {/* EN ATTENTE */}
        {activeTab === "enattente" && (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Incidents</th>
                <th>Description</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interventionsEnAttente.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    Pas d'intervention en attente.
                  </td>
                </tr>
              )}
              {interventionsEnAttente.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.incidentId}</td>
                  <td>{i.description}</td>
                  <td>{i.client}</td>
                  <td>{i.produit}</td>
                  <td>{formatDateTime(i.datetime)}</td>
                  <td>
                    <span className="badge bg-warning">{i.statut}</span>
                  </td>
                  <td>
                    <i
                      className="bi bi-play-circle-fill text-success action-icon"
                      title="Démarrer"
                      onClick={() => startIntervention(i.id)}
                    />
                    <i
                      className="bi bi-trash-fill text-danger action-icon"
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
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Client</th>
                <th>Produit</th>
                <th>Démarrée le</th>
                <th>Statut</th>
                <th>Rapport</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interventionsEnCours.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    Pas d'intervention en cours.
                  </td>
                </tr>
              )}
              {interventionsEnCours.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.description}</td>
                  <td>{i.client}</td>
                  <td>{i.produit}</td>
                  <td>{formatDateTime(i.startedAt)}</td>
                  <td>
                    <span className="badge bg-primary">{i.statut}</span>
                  </td>
                  <td>
                    <i
                      className="bi bi-journal-text text-info action-icon"
                      title="Rapport"
                      onClick={() => openReportForm(i)}
                    />
                    <i
                      className="bi bi-download text-success action-icon"
                      title="Télécharger rapport"
                      onClick={() => handleDownloadRapport(i)}
                    />
                  </td>
                  <td>
                    <i
                      className="bi bi-stop-circle-fill text-success action-icon"
                      title="Terminer"
                      onClick={() => handleFinishIntervention(i)}
                    />
                    <i
                      className="bi bi-trash-fill text-danger action-icon"
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
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
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
              {interventionsTerminees.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    Pas d'intervention terminée.
                  </td>
                </tr>
              )}
              {interventionsTerminees.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.description}</td>
                  <td>{i.client}</td>
                  <td>{i.produit}</td>
                  <td>{formatDateTime(i.startedAt)}</td>
                  <td>{formatDateTime(i.endedAt)}</td>
                  <td>
                    <span className="badge bg-success">{i.statut}</span>
                  </td>
                  <td>
                    <i
                      className="bi bi-journal-text text-info action-icon"
                      title="Voir rapport"
                      onClick={() => openReportForm(i)}
                    />
                    <i
                      className="bi bi-download text-success action-icon"
                      title="Télécharger rapport"
                      onClick={() => handleDownloadRapport(i)}
                    />
                  </td>
                  <td>
                    <i
                      className="bi bi-trash-fill text-danger action-icon"
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

      {/* Offcanvas */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Rapport d’intervention</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form>
            <div className="mb-3">
              <label>Date</label>
              <input
                type="datetime-local"
                className="form-control"
                value={rapport.date}
                onChange={(e) => setRapport({ ...rapport, date: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Client</label>
              <input
                type="text"
                className="form-control"
                value={rapport.client}
                onChange={(e) => setRapport({ ...rapport, client: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Intervenant</label>
              <input
                type="text"
                className="form-control"
                value={rapport.intervenant}
                onChange={(e) => setRapport({ ...rapport, intervenant: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Type Intervention</label>
              <input
                type="text"
                className="form-control"
                value={rapport.type}
                onChange={(e) => setRapport({ ...rapport, type: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={rapport.description}
                onChange={(e) => setRapport({ ...rapport, description: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Observation</label>
              <textarea
                className="form-control"
                value={rapport.observation}
                onChange={(e) => setRapport({ ...rapport, observation: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Travaux effectués</label>
              <textarea
                className="form-control"
                value={rapport.travaux}
                onChange={(e) => setRapport({ ...rapport, travaux: e.target.value })}
              />
            </div>
            <button type="button" className="btn btn-success w-100" onClick={handleSaveRapport}>
              Générer le rapport
            </button>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Interventions;

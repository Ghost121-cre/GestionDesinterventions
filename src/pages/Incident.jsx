import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useIncident } from "../context/IncidentContext";
import "../assets/css/Incident.css";

function Incident() {
  const { incidents, handleDelete, handleMarkResolved } = useIncident();
  const [activeTab, setActiveTab] = useState("nonresolu");

  // 🔎 Séparer par statut
  const incidentNonResolus = incidents.filter((i) => i.statut === "non résolu");
  const incidentsResolus = incidents.filter((i) => i.statut === "résolu");

  return (
    <div className="incident-container">
      {/* Onglets */}
      <ul className="nav nav-tabs custom-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "nonresolu" ? "active" : ""}`}
            onClick={() => setActiveTab("nonresolu")}
          >
            Non résolu ({incidentNonResolus.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "resolu" ? "active" : ""}`}
            onClick={() => setActiveTab("resolu")}
          >
            Résolu ({incidentsResolus.length})
          </button>
        </li>
      </ul>

      {/* Tableau Non résolu */}
      {activeTab === "nonresolu" && (
        <div>
          <h4>Incidents non résolus</h4>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Clients</th>
                <th>Produits</th>
                <th>Description</th>
                <th>Date Survenu</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incidentNonResolus.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Pas d'incidents non résolus.
                  </td>
                </tr>
              ) : (
                incidentNonResolus.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.client}</td>
                    <td>{i.produit}</td>
                    <td>{i.description}</td>
                    <td>{i.date_survenu}</td>
                    <td>
                      <span className="badge bg-warning">{i.statut}</span>
                    </td>
                    <td>
                      <i
                        className="bi bi-check-circle text-success me-2 action-icon"
                        title="Résoudre"
                        onClick={() => handleMarkResolved(i.id)}
                      />
                      <i
                        className="bi bi-trash-fill text-danger action-icon"
                        title="Supprimer"
                        onClick={() => handleDelete(i.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tableau Résolu */}
      {activeTab === "resolu" && (
        <div>
          <h4>Incidents résolus</h4>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Clients</th>
                <th>Produits</th>
                <th>Description</th>
                <th>Date Survenu</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incidentsResolus.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Pas d'incidents résolus.
                  </td>
                </tr>
              ) : (
                incidentsResolus.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.client}</td>
                    <td>{i.produit}</td>
                    <td>{i.description}</td>
                    <td>{i.date_survenu}</td>
                    <td>
                      <span className="badge bg-success">
                        <i className="bi bi-clock-fill me-1"></i>
                        {i.statut}
                      </span>
                    </td>
                    <td>
                      <i
                        className="bi bi-trash-fill text-danger action-icon"
                        title="Supprimer"
                        onClick={() => handleDelete(i.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Incident;

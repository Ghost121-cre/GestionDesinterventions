// src/pages/InterventionForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInterventions } from "../context/InterventionContext";
import { useIncident } from "../context/IncidentContext";
import "bootstrap/dist/css/bootstrap.min.css";

function InterventionForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const { addIntervention } = useInterventions();
  const { incidents } = useIncident();

  // Si on vient directement d’un incident
  const incidentFromNav = location.state?.incident;

  const clients = ["BNB", "SIB", "BNI"];
  const produits = ["pointis", "gescred", "activManagement"];
  const techniciens = ["Nacro", "Youssouf", "Issouf"];

  const [form, setForm] = useState({
    client: "",
    produit: "",
    description: "",
    datetime: "",
    technicien: "",
    incidentId: "",
  });

  // Pré-remplissage si navigation depuis un incident
  useEffect(() => {
    if (incidentFromNav) {
      setForm((prev) => ({
        ...prev,
        client: incidentFromNav.client,
        produit: incidentFromNav.produit,
        description: incidentFromNav.description,
        incidentId: incidentFromNav.id,
      }));
    }
  }, [incidentFromNav]);

  // 🔑 Remplissage auto quand on sélectionne un Incident
  useEffect(() => {
    if (form.incidentId) {
      const selectedIncident = incidents.find(
        (i) => i.id === Number(form.incidentId) && i.statut === "non résolu"
      );
      if (selectedIncident) {
        setForm((prev) => ({
          ...prev,
          client: selectedIncident.client,
          produit: selectedIncident.produit,
          description: selectedIncident.description,
        }));
      }
    }
  }, [form.incidentId, incidents]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.client || !form.produit || !form.description || !form.datetime) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newIntervention = {
      id: Date.now(),
      client: form.client,
      produit: form.produit,
      description: form.description,
      datetime: form.datetime,
      technicien: form.technicien,
      incidentId: form.incidentId || null,
    };

    addIntervention(newIntervention);
    navigate("/interventions");
  };

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li
            className="breadcrumb-item"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/Accueil")}
          >
            Accueil
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Intervention
          </li>
        </ol>
      </nav>
      <div className="card shadow-sm p-4">
        <h4 className="mb-3">Ajouter une intervention</h4>

        <form onSubmit={handleSubmit}>
          {/* Incident lié */}
          <div className="mb-3">
            <label>Incident associé (facultatif)</label>
            <select
              className="form-select"
              value={form.incidentId || ""}
              onChange={(e) =>
                setForm({ ...form, incidentId: e.target.value })
              }
            >
              <option value="">-- Sélectionner un incident non résolu --</option>
              {incidents
                .filter((i) => i.statut === "non résolu")
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    #{i.id} - {i.client} - {i.produit}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Client</label>
            <input
              type="text"
              className="form-control"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              required
              readOnly={!!form.incidentId} // 🔒 si lié à un incident
            />
          </div>

          <div className="mb-3">
            <label>Produit</label>
            <input
              type="text"
              className="form-control"
              value={form.produit}
              onChange={(e) => setForm({ ...form, produit: e.target.value })}
              required
              readOnly={!!form.incidentId}
            />
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              readOnly={!!form.incidentId}
            />
          </div>

          <h5>Planification</h5>

          <div className="mb-3">
            <label>Date et heure</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.datetime}
              onChange={(e) => setForm({ ...form, datetime: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label>Technicien</label>
            <select
              className="form-select"
              value={form.technicien}
              onChange={(e) => setForm({ ...form, technicien: e.target.value })}
            >
              <option value="">-- Sélectionner un technicien --</option>
              {techniciens.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Ajouter & Planifier
          </button>
        </form>
      </div>
    </div>
  );
}

export default InterventionForm;

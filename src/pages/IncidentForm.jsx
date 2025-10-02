import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CIcon from "@coreui/icons-react";
import { cilWarning } from "@coreui/icons";
import { useIncident } from "../context/IncidentContext";
import { toast } from "react-toastify"; // ✅ juste le toast, plus besoin de ToastContainer ici
import "../assets/css/Incident.css";

function IncidentForm() {
  const navigate = useNavigate();
  const { addIncident } = useIncident();

  const [form, setForm] = useState({
    client: "",
    produit: "",
    description: "",
    date_survenu: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.client || !form.produit || !form.description || !form.date_survenu) {
      toast.error("⚠️ Veuillez remplir tous les champs !");
      return;
    }

    addIncident(form);

    toast.success(`✅ Vous avez déclaré un incident pour ${form.client} !`);

    setTimeout(() => navigate("/incidents"), 1000);
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
            Incident
          </li>
        </ol>
      </nav>
      <div className="card shadow-sm p-4">
        <h4 className="mb-3">
          <CIcon icon={cilWarning} className="text-danger me-2" />
          Incident
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Client</label>
            <select
              className="form-select"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              required
            >
              <option value="">-- Sélectionner un client --</option>
              <option value="bnb">BNB</option>
              <option value="sib">SIB</option>
              <option value="bni">BNI</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Produit</label>
            <select
              className="form-select"
              value={form.produit}
              onChange={(e) => setForm({ ...form, produit: e.target.value })}
              required
            >
              <option value="">-- Sélectionner un produit --</option>
              <option value="pointis">Pointis</option>
              <option value="gescred">Gescred</option>
              <option value="activManagement">Activ Management</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label>Date survenue</label>
            <input
              type="date"
              className="form-control"
              value={form.date_survenu}
              onChange={(e) => setForm({ ...form, date_survenu: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger w-100">
            Déclarer
          </button>
        </form>
      </div>
    </div>
  );
}

export default IncidentForm;

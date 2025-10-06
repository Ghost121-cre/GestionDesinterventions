import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilWarning } from "@coreui/icons";
import "../assets/css/Accueil.css";

function Accueil() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        👋 Bienvenue dans la gestion des interventions
      </h2>

      <div className="row g-3 justify-content-center">
        {/* Carte Déclarer Incident */}
        <div className="col-md-4">
          <div
            className="card text-center shadow-sm"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/declarer_incident")}
          >
            <div className="card-body">
              <CIcon icon={cilWarning} size="2xl" className="mb-2 text-danger" />
              <h5 className="card-title">Déclarer un Incident</h5>
              <p className="card-text">Signalez rapidement un problème</p>
            </div>
          </div>
        </div>

        {/* Carte Ajouter Intervention */}
        <div className="col-md-4">
          <div
            className="card text-center shadow-sm"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/ajouter_intervention")}
          >
            <div className="card-body">
              <CIcon icon={cilPlus} size="2xl" className="mb-2 text-success" />
              <h5 className="card-title">Ajouter une Intervention</h5>
              <p className="card-text">Planifiez et enregistrez vos interventions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;

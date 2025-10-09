import React from "react"; 
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CIcon from "@coreui/icons-react";
import { cilPlus, cilWarning } from "@coreui/icons";
import styles from "../assets/css/Accueil.module.css";

function Accueil() {
  const navigate = useNavigate();

  return (
    <div className={styles.accueilContainer}>
      <h2>👋 Bienvenue dans la gestion des interventions</h2>

      <div className="row g-4 justify-content-center mt-4">
        {/* Carte Déclarer Incident */}
        <div className="col-md-4 col-sm-6">
          <div
            className={styles.accueilCard}
            onClick={() => navigate("/declarer_incident")}
          >
            <CIcon icon={cilWarning} size="3xl" className={`mb-3 text-danger ${styles.ciIcon}`} />
            <h5 className={styles.cardTitle}>Déclarer un Incident</h5>
            <p className={styles.cardText}>Signalez rapidement un problème</p>
          </div>
        </div>

        {/* Carte Ajouter Intervention */}
        <div className="col-md-4 col-sm-6">
          <div
            className={styles.accueilCard}
            onClick={() => navigate("/ajouter_intervention")}
          >
            <CIcon icon={cilPlus} size="3xl" className={`mb-3 text-success ${styles.ciIcon}`} />
            <h5 className={styles.cardTitle}>Ajouter une Intervention</h5>
            <p className={styles.cardText}>Planifiez et enregistrez vos interventions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;

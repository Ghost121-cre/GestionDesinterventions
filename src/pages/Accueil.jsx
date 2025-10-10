import React, { useState, useEffect, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CIcon from "@coreui/icons-react";
import { 
  cilPlus, 
  cilWarning, 
  cilListRich, 
  cilChartLine,
  cilUser,
  cilClock,
  cilCheckCircle
} from "@coreui/icons";
import styles from "../assets/css/Accueil.module.css";
import { useInterventions } from "../context/InterventionContext";
import { useIncident } from "../context/IncidentContext"; // CHANGEMENT ICI : useIncident au singulier

function Accueil() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Utilisation de vos vrais contextes - CORRECTION ICI
  const { interventions } = useInterventions();
  const { incidents } = useIncident(); // CHANGEMENT ICI : useIncident() au singulier

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calcul des statistiques réelles basées sur vos données
  const getRealStats = () => {
    const interventionsEnCours = interventions.filter(i => i.statut === "En cours").length;
    const interventionsTerminees = interventions.filter(i => i.statut === "Terminé").length;
    const interventionsEnAttente = interventions.filter(i => i.statut === "En attente").length;
    
    // Utilisation correcte de vos données d'incidents
    const incidentsNonResolus = incidents.filter(inc => inc.statut === "non résolu").length;

    return {
      interventionsEnCours,
      interventionsTerminees,
      interventionsEnAttente,
      incidentsNonResolus
    };
  };

  // Activité récente basée sur vos vraies données
  const getRecentActivity = () => {
    // Combiner interventions et incidents pour l'activité récente
    const allActivities = [
      ...interventions.map(i => ({
        type: 'intervention',
        id: i.id,
        title: `Intervention #${i.id} ${i.statut?.toLowerCase()}`,
        description: i.client || i.produit || 'Intervention',
        time: i.createdAt || i.date || i.datetime,
        icon: i.statut === 'Terminé' ? cilCheckCircle : 
              i.statut === 'En cours' ? cilClock : cilWarning,
        color: i.statut === 'Terminé' ? 'success' : 
               i.statut === 'En cours' ? 'warning' : 'primary'
      })),
      ...incidents.map(inc => ({
        type: 'incident',
        id: inc.id,
        title: `Incident #${inc.id} ${inc.statut}`,
        description: inc.description || 'Incident signalé',
        time: inc.date_incident || inc.createdAt,
        icon: inc.statut === 'résolu' ? cilCheckCircle : cilWarning,
        color: inc.statut === 'résolu' ? 'success' : 'danger'
      }))
    ];

    // Trier par date et prendre les 3 plus récents
    return allActivities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 3);
  };

  const stats = getRealStats();
  const recentActivity = getRecentActivity();

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Date inconnue";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const quickActions = [
    {
      title: "Déclarer un Incident",
      description: "Signalez rapidement un problème technique",
      icon: cilWarning,
      path: "/declarer_incident",
      color: "danger",
      badge: stats.incidentsNonResolus
    },
    {
      title: "Ajouter une Intervention",
      description: "Planifiez et enregistrez vos interventions",
      icon: cilPlus,
      path: "/ajouter_intervention",
      color: "success"
    },
    {
      title: "Voir les Interventions",
      description: "Consultez et gérez toutes les interventions",
      icon: cilListRich,
      path: "/interventions",
      color: "primary",
      badge: stats.interventionsEnCours
    },
    {
      title: "Tableau de Bord",
      description: "Analyses et statistiques en temps réel",
      icon: cilChartLine,
      path: "/dashboard",
      color: "info"
    }
  ];

  const statsCards = [
    {
      title: "En Cours",
      value: stats.interventionsEnCours,
      icon: cilClock,
      color: "warning",
      description: "Interventions actives"
    },
    {
      title: "Terminées",
      value: stats.interventionsTerminees,
      icon: cilCheckCircle,
      color: "success",
      description: "Au total"
    },
    {
      title: "En Attente",
      value: stats.interventionsEnAttente,
      icon: cilListRich,
      color: "info",
      description: "À planifier"
    },
    {
      title: "Incidents",
      value: stats.incidentsNonResolus,
      icon: cilWarning,
      color: "danger",
      description: "Non résolus"
    }
  ];

  return (
    <div className={styles.accueilContainer}>
      {/* En-tête avec date et heure */}
      <div className={styles.headerSection}>
        <div className={styles.welcomeMessage}>
          <h1>👋 Bonjour, Bienvenue !</h1>
          <p className={styles.subtitle}>
            Gestion des interventions - {interventions.length} intervention(s), {incidents.length} incident(s)
          </p>
        </div>
        <div className={styles.timeSection}>
          <div className={styles.currentTime}>
            {formatTime(currentTime)}
          </div>
          <div className={styles.currentDate}>
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className={styles.statsSection}>
        <h3 className={styles.sectionTitle}>Aperçu en Temps Réel</h3>
        <div className="row g-3 justify-content-center">
          {statsCards.map((stat, index) => (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div className={`${styles.statCard} ${styles[stat.color]}`}>
                <div className={styles.statIcon}>
                  <CIcon icon={stat.icon} size="2xl" />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statTitle}>{stat.title}</div>
                  <div className={styles.statDescription}>{stat.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className={styles.actionsSection}>
        <h3 className={styles.sectionTitle}>Actions Rapides</h3>
        <div className="row g-4 justify-content-center">
          {quickActions.map((action, index) => (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6">
              <div
                className={`${styles.actionCard} ${styles[action.color]}`}
                onClick={() => navigate(action.path)}
              >
                <div className={styles.cardHeader}>
                  <CIcon 
                    icon={action.icon} 
                    size="3xl" 
                    className={styles.actionIcon} 
                  />
                  {action.badge > 0 && (
                    <span className={styles.badge}>{action.badge}</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h5 className={styles.cardTitle}>{action.title}</h5>
                  <p className={styles.cardText}>{action.description}</p>
                </div>
                <div className={styles.cardHover}>
                  <span>Cliquer pour accéder →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section activité récente */}
      <div className={styles.recentSection}>
        <h3 className={styles.sectionTitle}>Activité Récente</h3>
        <div className={styles.recentActivity}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <CIcon 
                  icon={activity.icon} 
                  className={styles.activityIcon} 
                  style={{ color: `var(--${activity.color}-color)` }}
                />
                <div className={styles.activityContent}>
                  <span>{activity.title}</span>
                  <small>{activity.description} • {formatRelativeTime(activity.time)}</small>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noActivity}>
              <CIcon icon={cilListRich} size="2xl" className={styles.noActivityIcon} />
              <p>Aucune activité récente</p>
              <small>Les nouvelles interventions et incidents apparaîtront ici</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Accueil;
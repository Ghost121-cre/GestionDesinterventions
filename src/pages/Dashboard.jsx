import React, { useMemo } from "react";
import { useInterventions } from "../context/InterventionContext";
import { useRapports } from "../context/RapportContext";
import { useIncident } from "../context/IncidentContext";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import styles from "../assets/css/Dashboard.module.css";
import CIcon from "@coreui/icons-react";
import {
  cilClock,
  cilArrowRight,
  cilCheckCircle,
  cilWarning,
  cilChartLine,
  cilUser,
  cilCalendar,
  cilFile,
  cilSpeedometer
} from "@coreui/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

function Dashboard() {
  const { interventions } = useInterventions();
  const { rapports } = useRapports();
  const { incidents } = useIncident();

  // Calcul des métriques principales
  const metrics = useMemo(() => {
    const enAttente = interventions.filter((i) => i.statut === "En attente").length;
    const enCours = interventions.filter((i) => i.statut === "En cours").length;
    const terminees = interventions.filter((i) => i.statut === "Terminé").length;
    const incidentsNonResolus = incidents.filter((i) => i.statut === "non résolu").length;
    const incidentsResolus = incidents.filter((i) => i.statut === "résolu").length;

    // Taux de résolution
    const tauxResolution = interventions.length > 0 
      ? Math.round((terminees / interventions.length) * 100)
      : 0;

    // Interventions cette semaine
    const cetteSemaine = interventions.filter(i => {
      const date = new Date(i.datetime || i.createdAt);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      return date >= startOfWeek;
    }).length;

    // Temps moyen de résolution (simulé)
    const tempsMoyen = interventions.length > 0 ? "2.5j" : "0j";

    return {
      enAttente,
      enCours,
      terminees,
      incidentsNonResolus,
      incidentsResolus,
      tauxResolution,
      cetteSemaine,
      tempsMoyen,
      totalInterventions: interventions.length,
      totalRapports: rapports.length,
      totalIncidents: incidents.length
    };
  }, [interventions, rapports, incidents]);

  // Données pour le graphique des interventions
  const interventionsData = {
    labels: ["En attente", "En cours", "Terminé"],
    datasets: [
      {
        label: "Interventions",
        data: [metrics.enAttente, metrics.enCours, metrics.terminees],
        backgroundColor: [
          "rgba(255, 193, 7, 0.8)",
          "rgba(13, 110, 253, 0.8)",
          "rgba(25, 135, 84, 0.8)"
        ],
        borderColor: [
          "rgb(255, 193, 7)",
          "rgb(13, 110, 253)",
          "rgb(25, 135, 84)"
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Données pour les incidents
  const incidentsData = {
    labels: ["Non résolus", "Résolus"],
    datasets: [
      {
        label: "Incidents",
        data: [metrics.incidentsNonResolus, metrics.incidentsResolus],
        backgroundColor: [
          "rgba(220, 53, 69, 0.8)",
          "rgba(40, 167, 69, 0.8)"
        ],
        borderColor: [
          "rgb(220, 53, 69)",
          "rgb(40, 167, 69)"
        ],
        borderWidth: 2,
      },
    ],
  };

  // Données pour l'évolution mensuelle (simulée)
  const evolutionData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
    datasets: [
      {
        label: "Interventions",
        data: [12, 19, 15, 25, 22, metrics.totalInterventions],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Incidents",
        data: [8, 12, 10, 15, 18, metrics.totalIncidents],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Données pour la répartition par priorité (simulée)
  const prioriteData = {
    labels: ["Haute", "Moyenne", "Basse"],
    datasets: [
      {
        label: "Interventions par priorité",
        data: [8, 15, 12],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(34, 197, 94, 0.8)"
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(245, 158, 11)",
          "rgb(34, 197, 94)"
        ],
        borderWidth: 2,
      },
    ],
  };

  // Options des graphiques
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 11
          }
        }
      }
    },
    cutout: '60%',
  };

  return (
    <div className={styles.container}>
      {/* En-tête */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <CIcon icon={cilSpeedometer} className={styles.titleIcon} />
            Tableau de Bord
          </h1>
          <p className={styles.subtitle}>
            Vue d'ensemble complète de votre activité
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>{metrics.totalInterventions}</span>
            <span className={styles.headerStatLabel}>Interventions totales</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>{metrics.totalIncidents}</span>
            <span className={styles.headerStatLabel}>Incidents signalés</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>{metrics.totalRapports}</span>
            <span className={styles.headerStatLabel}>Rapports générés</span>
          </div>
        </div>
      </div>

      {/* Cartes de métriques principales */}
      <div className={styles.metricsGrid}>
        <div className={`${styles.metricCard} ${styles.metricPrimary}`}>
          <div className={styles.metricIcon}>
            <CIcon icon={cilClock} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{metrics.enAttente}</div>
            <div className={styles.metricLabel}>En attente</div>
          </div>
          <div className={styles.metricTrend}>
            <span className={styles.trendText}>+2 cette semaine</span>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.metricInfo}`}>
          <div className={styles.metricIcon}>
            <CIcon icon={cilArrowRight} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{metrics.enCours}</div>
            <div className={styles.metricLabel}>En cours</div>
          </div>
          <div className={styles.metricTrend}>
            <span className={styles.trendText}>Actives</span>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.metricSuccess}`}>
          <div className={styles.metricIcon}>
            <CIcon icon={cilCheckCircle} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{metrics.terminees}</div>
            <div className={styles.metricLabel}>Terminées</div>
          </div>
          <div className={styles.metricTrend}>
            <span className={styles.trendText}>{metrics.tauxResolution}% taux</span>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.metricWarning}`}>
          <div className={styles.metricIcon}>
            <CIcon icon={cilWarning} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{metrics.incidentsNonResolus}</div>
            <div className={styles.metricLabel}>Incidents actifs</div>
          </div>
          <div className={styles.metricTrend}>
            <span className={styles.trendText}>À traiter</span>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.metricSecondary}`}>
          <div className={styles.metricIcon}>
            <CIcon icon={cilCalendar} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{metrics.cetteSemaine}</div>
            <div className={styles.metricLabel}>Cette semaine</div>
          </div>
          <div className={styles.metricTrend}>
            <span className={styles.trendText}>Nouvelles</span>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.metricDark}`}>
          <div className={styles.metricIcon}>
            <CIcon icon={cilChartLine} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{metrics.tempsMoyen}</div>
            <div className={styles.metricLabel}>Temps moyen</div>
          </div>
          <div className={styles.metricTrend}>
            <span className={styles.trendText}>Résolution</span>
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className={styles.chartsGrid}>
        {/* Répartition des interventions */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <CIcon icon={cilChartLine} className={styles.chartIcon} />
              Répartition des Interventions
            </h3>
          </div>
          <div className={styles.chartContainer}>
            <Pie data={interventionsData} options={pieOptions} />
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <CIcon icon={cilChartLine} className={styles.chartIcon} />
              Évolution Mensuelle
            </h3>
          </div>
          <div className={styles.chartContainer}>
            <Line data={evolutionData} options={lineOptions} />
          </div>
        </div>

        {/* Statut des incidents */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <CIcon icon={cilWarning} className={styles.chartIcon} />
              Statut des Incidents
            </h3>
          </div>
          <div className={styles.chartContainer}>
            <Doughnut data={incidentsData} options={doughnutOptions} />
          </div>
        </div>

        {/* Priorité des interventions */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>
              <CIcon icon={cilUser} className={styles.chartIcon} />
              Par Niveau de Priorité
            </h3>
          </div>
          <div className={styles.chartContainer}>
            <Bar 
              data={prioriteData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Résumé rapide */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h4 className={styles.summaryTitle}>Performance du Mois</h4>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Interventions traitées:</span>
              <span className={styles.summaryValue}>{metrics.terminees}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Taux de réussite:</span>
              <span className={styles.summaryValue}>{metrics.tauxResolution}%</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Incidents résolus:</span>
              <span className={styles.summaryValue}>{metrics.incidentsResolus}</span>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <h4 className={styles.summaryTitle}>Activité Récente</h4>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Nouvelles interventions:</span>
              <span className={styles.summaryValue}>{metrics.cetteSemaine}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Rapports générés:</span>
              <span className={styles.summaryValue}>{metrics.totalRapports}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>En attente:</span>
              <span className={styles.summaryValue}>{metrics.enAttente}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
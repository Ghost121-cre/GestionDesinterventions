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
  cilSpeedometer,
} from "@coreui/icons";

// Enregistrement des composants ChartJS avec gestion d'erreur
try {
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
} catch (error) {
  console.warn("ChartJS registration warning:", error);
}

// Composant de fallback en cas d'erreur
const ChartErrorFallback = ({ message }) => (
  <div className={styles.chartError}>
    <CIcon icon={cilWarning} className={styles.errorIcon} />
    <div className={styles.errorText}>{message}</div>
  </div>
);

function Dashboard() {
  const { interventions = [] } = useInterventions() || {};
  const { rapports = [] } = useRapports() || {};
  const { incidents = [] } = useIncident() || {};

  // Fonction utilitaire pour parser les dates en toute sécurité
  const safeParseDate = (dateString) => {
    if (!dateString) return new Date();
    try {
      return new Date(dateString);
    } catch (error) {
      console.warn("Erreur parsing date:", dateString, error);
      return new Date();
    }
  };

  // Fonction pour calculer le temps moyen de résolution avec gestion d'erreur
  const calculateTempsMoyenResolution = (interventions) => {
    try {
      const interventionsTerminees = interventions.filter(
        (i) => i && i.statut === "Terminé" && i.startedAt && i.endedAt
      );

      if (interventionsTerminees.length === 0) return "0j";

      const totalDuree = interventionsTerminees.reduce(
        (total, intervention) => {
          try {
            const start = safeParseDate(intervention.startedAt);
            const end = safeParseDate(intervention.endedAt);
            const dureeMs = end - start;
            return total + (isNaN(dureeMs) ? 0 : dureeMs);
          } catch (error) {
            console.warn(
              "Erreur calcul durée intervention:",
              intervention.id,
              error
            );
            return total;
          }
        },
        0
      );

      const moyenneMs = totalDuree / interventionsTerminees.length;
      const moyenneJours =
        Math.round((moyenneMs / (1000 * 60 * 60 * 24)) * 10) / 10;

      return isNaN(moyenneJours) ? "0j" : `${moyenneJours}j`;
    } catch (error) {
      console.error("Erreur calcul temps moyen:", error);
      return "0j";
    }
  };

  // Fonction pour calculer les priorités réelles avec gestion d'erreur
  const calculatePriorites = (interventions) => {
    try {
      const haute = interventions.filter(
        (i) => i && (i.priorite === "high" || i.priorite === "Haute")
      ).length;

      const moyenne = interventions.filter(
        (i) => i && (i.priorite === "medium" || i.priorite === "Moyenne")
      ).length;

      const basse = interventions.filter(
        (i) => i && (i.priorite === "low" || i.priorite === "Basse")
      ).length;

      return { haute, moyenne, basse };
    } catch (error) {
      console.error("Erreur calcul priorités:", error);
      return { haute: 0, moyenne: 0, basse: 0 };
    }
  };

  // Fonction pour calculer l'évolution mensuelle réelle avec gestion d'erreur
  const calculateEvolutionMensuelle = (interventions) => {
    try {
      const maintenant = new Date();
      const evolution = Array(6).fill(0);

      interventions.forEach((intervention) => {
        try {
          if (!intervention) return;

          const date = safeParseDate(
            intervention.datetime ||
              intervention.createdAt ||
              intervention.date_planifiee
          );
          const moisDiff =
            (maintenant.getFullYear() - date.getFullYear()) * 12 +
            maintenant.getMonth() -
            date.getMonth();

          if (moisDiff >= 0 && moisDiff < 6) {
            evolution[5 - moisDiff]++;
          }
        } catch (error) {
          console.warn(
            "Erreur calcul évolution intervention:",
            intervention.id,
            error
          );
        }
      });

      return evolution;
    } catch (error) {
      console.error("Erreur calcul évolution mensuelle:", error);
      return Array(6).fill(0);
    }
  };

  // Fonction pour obtenir les labels des 6 derniers mois
  const getLast6MonthsLabels = () => {
    try {
      const mois = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      const maintenant = new Date();
      const labels = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(
          maintenant.getFullYear(),
          maintenant.getMonth() - i,
          1
        );
        labels.push(mois[date.getMonth()]);
      }

      return labels;
    } catch (error) {
      console.error("Erreur génération labels mois:", error);
      return ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"];
    }
  };

  // Fonction pour calculer l'évolution des incidents
  const calculateEvolutionIncidents = (incidents) => {
    try {
      const maintenant = new Date();
      const evolution = Array(6).fill(0);

      incidents.forEach((incident) => {
        try {
          if (!incident) return;

          const date = safeParseDate(
            incident.date_incident || incident.createdAt
          );
          const moisDiff =
            (maintenant.getFullYear() - date.getFullYear()) * 12 +
            maintenant.getMonth() -
            date.getMonth();

          if (moisDiff >= 0 && moisDiff < 6) {
            evolution[5 - moisDiff]++;
          }
        } catch (error) {
          console.warn("Erreur calcul évolution incident:", incident.id, error);
        }
      });

      return evolution;
    } catch (error) {
      console.error("Erreur calcul évolution incidents:", error);
      return Array(6).fill(0);
    }
  };

  // Calcul des métriques principales avec gestion d'erreur complète
  const metrics = useMemo(() => {
    try {
      // Vérification que les données sont des tableaux
      const safeInterventions = Array.isArray(interventions)
        ? interventions
        : [];
      const safeRapports = Array.isArray(rapports) ? rapports : [];
      const safeIncidents = Array.isArray(incidents) ? incidents : [];

      const enAttente = safeInterventions.filter(
        (i) => i && i.statut === "En attente"
      ).length;
      const enCours = safeInterventions.filter(
        (i) => i && i.statut === "En cours"
      ).length;
      const terminees = safeInterventions.filter(
        (i) => i && i.statut === "Terminé"
      ).length;
      const incidentsNonResolus = safeIncidents.filter(
        (i) => i && i.statut === "non résolu"
      ).length;
      const incidentsResolus = safeIncidents.filter(
        (i) => i && i.statut === "résolu"
      ).length;

      // Taux de résolution
      const tauxResolution =
        safeInterventions.length > 0
          ? Math.round((terminees / safeInterventions.length) * 100)
          : 0;

      // Interventions cette semaine (calcul réel)
      const cetteSemaine = safeInterventions.filter((i) => {
        try {
          if (!i) return false;
          const date = safeParseDate(
            i.datetime || i.createdAt || i.date_planifiee
          );
          const now = new Date();
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
          );
          startOfWeek.setHours(0, 0, 0, 0);
          return date >= startOfWeek;
        } catch (error) {
          console.warn("Erreur calcul semaine intervention:", i?.id, error);
          return false;
        }
      }).length;

      // Calcul du temps moyen de résolution réel
      const tempsMoyen = calculateTempsMoyenResolution(safeInterventions);

      // Calcul des priorités réelles
      const priorites = calculatePriorites(safeInterventions);

      // Évolution mensuelle réelle
      const evolutionMensuelle = calculateEvolutionMensuelle(safeInterventions);

      return {
        enAttente,
        enCours,
        terminees,
        incidentsNonResolus,
        incidentsResolus,
        tauxResolution,
        cetteSemaine,
        tempsMoyen,
        totalInterventions: safeInterventions.length,
        totalRapports: safeRapports.length,
        totalIncidents: safeIncidents.length,
        priorites,
        evolutionMensuelle,
      };
    } catch (error) {
      console.error("Erreur calcul métriques:", error);
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        enAttente: 0,
        enCours: 0,
        terminees: 0,
        incidentsNonResolus: 0,
        incidentsResolus: 0,
        tauxResolution: 0,
        cetteSemaine: 0,
        tempsMoyen: "0j",
        totalInterventions: 0,
        totalRapports: 0,
        totalIncidents: 0,
        priorites: { haute: 0, moyenne: 0, basse: 0 },
        evolutionMensuelle: Array(6).fill(0),
      };
    }
  }, [interventions, rapports, incidents]);

  // Données pour les graphiques avec gestion d'erreur
  const interventionsData = {
    labels: ["En attente", "En cours", "Terminé"],
    datasets: [
      {
        label: "Interventions",
        data: [metrics.enAttente, metrics.enCours, metrics.terminees],
        backgroundColor: [
          "rgba(255, 193, 7, 0.8)",
          "rgba(13, 110, 253, 0.8)",
          "rgba(25, 135, 84, 0.8)",
        ],
        borderColor: [
          "rgb(255, 193, 7)",
          "rgb(13, 110, 253)",
          "rgb(25, 135, 84)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const incidentsData = {
    labels: ["Non résolus", "Résolus"],
    datasets: [
      {
        label: "Incidents",
        data: [metrics.incidentsNonResolus, metrics.incidentsResolus],
        backgroundColor: ["rgba(220, 53, 69, 0.8)", "rgba(40, 167, 69, 0.8)"],
        borderColor: ["rgb(220, 53, 69)", "rgb(40, 167, 69)"],
        borderWidth: 2,
      },
    ],
  };

  const evolutionData = {
    labels: getLast6MonthsLabels(),
    datasets: [
      {
        label: "Interventions",
        data: metrics.evolutionMensuelle,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Incidents",
        data: calculateEvolutionIncidents(incidents),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const prioriteData = {
    labels: ["Haute", "Moyenne", "Basse"],
    datasets: [
      {
        label: "Interventions par priorité",
        data: [
          metrics.priorites.haute,
          metrics.priorites.moyenne,
          metrics.priorites.basse,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(245, 158, 11)",
          "rgb(34, 197, 94)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Options des graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Composant de graphique sécurisé
  const SafeChart = ({ type, data, options, fallbackMessage }) => {
    try {
      const ChartComponent = type;
      return <ChartComponent data={data} options={options} />;
    } catch (error) {
      console.error(`Erreur rendu graphique ${type.name}:`, error);
      return <ChartErrorFallback message={fallbackMessage} />;
    }
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
            <span className={styles.headerStatValue}>
              {metrics.totalInterventions}
            </span>
            <span className={styles.headerStatLabel}>
              Interventions totales
            </span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>
              {metrics.totalIncidents}
            </span>
            <span className={styles.headerStatLabel}>Incidents signalés</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>
              {metrics.totalRapports}
            </span>
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
            <span className={styles.trendText}>
              {metrics.cetteSemaine > 0
                ? `+${metrics.cetteSemaine} cette semaine`
                : "Aucune nouvelle"}
            </span>
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
            <span className={styles.trendText}>
              {metrics.tauxResolution}% taux
            </span>
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.metricWarning}`}>
          <div className={styles.metricIcon}>
            <CIcon icon={cilWarning} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>
              {metrics.incidentsNonResolus}
            </div>
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
            <SafeChart
              type={Pie}
              data={interventionsData}
              options={chartOptions}
              fallbackMessage="Erreur d'affichage du graphique des interventions"
            />
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
            <SafeChart
              type={Line}
              data={evolutionData}
              options={chartOptions}
              fallbackMessage="Erreur d'affichage du graphique d'évolution"
            />
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
            <SafeChart
              type={Doughnut}
              data={incidentsData}
              options={chartOptions}
              fallbackMessage="Erreur d'affichage du graphique des incidents"
            />
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
            <SafeChart
              type={Bar}
              data={prioriteData}
              options={chartOptions}
              fallbackMessage="Erreur d'affichage du graphique des priorités"
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
              <span className={styles.summaryLabel}>
                Interventions traitées:
              </span>
              <span className={styles.summaryValue}>{metrics.terminees}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Taux de réussite:</span>
              <span className={styles.summaryValue}>
                {metrics.tauxResolution}%
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Incidents résolus:</span>
              <span className={styles.summaryValue}>
                {metrics.incidentsResolus}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <h4 className={styles.summaryTitle}>Activité Récente</h4>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>
                Nouvelles interventions:
              </span>
              <span className={styles.summaryValue}>
                {metrics.cetteSemaine}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Rapports générés:</span>
              <span className={styles.summaryValue}>
                {metrics.totalRapports}
              </span>
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

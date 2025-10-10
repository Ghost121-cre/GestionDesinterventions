import React from "react";
import { useInterventions } from "../context/InterventionContext";
import { useRapports } from "../context/RapportContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import styles from "../assets/css/Dashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { interventions } = useInterventions();
  const { rapports } = useRapports();

  const enAttente = interventions.filter((i) => i.statut === "En attente").length;
  const enCours = interventions.filter((i) => i.statut === "En cours").length;
  const terminee = interventions.filter((i) => i.statut === "Terminé").length;

  const interventionsData = {
    labels: ["En attente", "En cours", "Terminé"],
    datasets: [
      {
        label: "Interventions",
        data: [enAttente, enCours, terminee],
        backgroundColor: ["#ffc107", "#0d6efd", "#198754"],
        borderColor: ["#ffc107", "#0d6efd", "#198754"],
        borderWidth: 2,
      },
    ],
  };

  const rapportsData = {
    labels: ["Rapports générés"],
    datasets: [
      {
        label: "Nombre de rapports",
        data: [rapports.length],
        backgroundColor: ["#6610f2"],
        borderColor: ["#6610f2"],
        borderWidth: 2,
        borderRadius: 8, // Pour rendre la barre plus jolie
      },
    ],
  };

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
            size: 12
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
    cutout: "40%",
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Rapports: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Pour avoir des nombres entiers
        },
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
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tableau de bord</h2>
        <p className={styles.subtitle}>Vue d'ensemble de votre activité</p>
      </div>

      <div className={styles.cardsContainer}>
        <div className={`${styles.card} ${styles.cardAttente}`}>
          <h3>{enAttente}</h3>
          <p>En attente</p>
        </div>
        <div className={`${styles.card} ${styles.cardEncours}`}>
          <h3>{enCours}</h3>
          <p>En cours</p>
        </div>
        <div className={`${styles.card} ${styles.cardTerminee}`}>
          <h3>{terminee}</h3>
          <p>Terminées</p>
        </div>
      </div>

      <div className={styles.chartsContainer}>
        {/* Carte Pie - Même taille que Bar */}
        <div className={styles.chart}>
          <h4>Répartition des interventions</h4>
          <div className={styles.chartCanvasContainer}>
            <div className={styles.pieChartWrapper}>
              <Pie
                data={interventionsData}
                options={pieOptions}
              />
            </div>
          </div>
        </div>

        {/* Carte Bar - Même taille que Pie */}
        <div className={styles.chart}>
          <h4>Rapports générés</h4>
          <div className={styles.chartCanvasContainer}>
            <div className={styles.barChartWrapper}>
              <Bar
                data={rapportsData}
                options={barOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
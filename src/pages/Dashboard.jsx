// src/pages/Dashboard.jsx
import React from "react";
import "../assets/css/Dashboard.css";
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
      },
    ],
  };

  const rapportsData = {
    labels: ["Total Rapports"],
    datasets: [
      {
        label: "Rapports générés",
        data: [rapports.length],
        backgroundColor: ["#6610f2"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Tableau de bord</h2>

      <div className="cards-container">
        <div className="card card-attente">
          <h3>{enAttente}</h3>
          <p>En attente</p>
        </div>
        <div className="card card-encours">
          <h3>{enCours}</h3>
          <p>En cours</p>
        </div>
        <div className="card card-terminee">
          <h3>{terminee}</h3>
          <p>Terminées</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart pie-chart">
          <h4>Répartition des interventions</h4>
          <Pie
            data={interventionsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "40%", // rend le cercle plus fin (type donut)
            }}
          />
        </div>

        <div className="chart bar-chart">
          <h4>Rapports générés</h4>
          <Bar
            data={rapportsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// src/utils/pdfGenerator.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/images/activ.png"; // adapte le chemin selon ton projet

export const generateRapportPDF = (rapport, intervention) => {
  const doc = new jsPDF();

  // === Logo et titre ===
  const imgWidth = 40;
  const imgHeight = 20;
  doc.addImage(logo, "PNG", 15, 10, imgWidth, imgHeight);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(34, 139, 34); // vert foncé
  doc.text("Rapport d'Intervention", 70, 25);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date : ${rapport.date}`, 15, 50);
  doc.text(`Client : ${rapport.client}`, 15, 60);
  doc.text(`Intervenant : ${rapport.intervenant}`, 15, 70);
  doc.text(`Type Intervention : ${rapport.type}`, 15, 80);

  // === Tableau ===
  autoTable(doc, {
    startY: 95,
    head: [["Description", "Observation", "Travaux effectués"]],
    body: [[rapport.description, rapport.observation, rapport.travaux]],
    theme: "grid",
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: [255, 255, 255],
      halign: "center",
      fontStyle: "bold",
    },
    bodyStyles: { fontSize: 11 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // === Pied de page ===
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Document généré automatiquement", 15, pageHeight - 10);

  // === Sauvegarde ===
  doc.save(`Rapport_${intervention.id}.pdf`);
};

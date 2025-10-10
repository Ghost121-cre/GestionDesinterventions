import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/images/activ.png"; // 🖼️ adapte le chemin selon ton projet

/**
 * Génère un PDF "Fiche d'intervention" avec cadre et design pro
 * @param {Object} rapport - Données du rapport (client, description, etc.)
 * @param {Object} intervention - Données de l'intervention (numéro, date, technicien, etc.)
 */
export const generateRapportPDF = (rapport, intervention) => {
  const doc = new jsPDF();

  // === CONFIGURATION ===
  const marginLeft = 15;
  const marginTop = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = marginTop;

  // === CADRE GLOBAL ===
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // cadre général

  // === LOGO ===
  const imgWidth = 40;
  const imgHeight = 15;
  doc.addImage(logo, "PNG", marginLeft, currentY, imgWidth, imgHeight);

  // === TITRE ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHE D'INTERVENTION", marginLeft + imgWidth + 10, currentY + 10);

  currentY += imgHeight + 10;

  // === TABLEAU INFORMATIONS INTERVENTION ===
  const interventionData = [
    ["Numéro", ":", intervention?.numero || intervention?.id || "2025-10-002"],
    ["Date", ":", rapport?.date || "09-10-25"],
    ["Horaire (Début -- Fin)", ":", rapport?.horaire || "De 11H07 À 18H00"],
  ];

  autoTable(doc, {
    startY: currentY,
    body: interventionData,
    theme: "plain",
    styles: { fontSize: 11, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 10 },
      2: { cellWidth: 120 },
    },
    margin: { left: marginLeft },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // === INFORMATIONS CLIENT / INTERVENANT ===
  const infoData = [
    ["CLIENT", rapport?.client || intervention?.client || ""],
    ["INTERVENANT", rapport?.intervenant || intervention?.technicien || ""],
    ["TYPE D'INTERVENTION", rapport?.type || intervention?.type || "Support"],
  ];

  autoTable(doc, {
    startY: currentY,
    body: infoData,
    theme: "plain",
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, fillColor: [240, 240, 240] },
      1: { cellWidth: 140 },
    },
    margin: { left: marginLeft },
  });

  currentY = doc.lastAutoTable.finalY + 15;

  // === LIGNE DE SÉPARATION ===
  doc.setDrawColor(0, 0, 0);
  doc.line(marginLeft, currentY, 195, currentY);
  currentY += 10;

  // === SECTION DEMANDE DU CLIENT ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("DEMANDE DU CLIENT", marginLeft, currentY);
  currentY += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const demandeLines = doc.splitTextToSize(
    rapport?.description || intervention?.description || "",
    180
  );
  doc.text(demandeLines, marginLeft, currentY);
  currentY += demandeLines.length * 7 + 10;

  // === SECTION OBSERVATION ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("OBSERVATION", marginLeft, currentY);
  currentY += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const observationLines = doc.splitTextToSize(rapport?.observation || "", 180);
  doc.text(observationLines, marginLeft, currentY);
  currentY += observationLines.length * 7 + 10;

  // === SECTION TRAVAUX EFFECTUÉS ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TRAVAUX EFFECTUÉS", marginLeft, currentY);
  currentY += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const travauxLines = doc.splitTextToSize(rapport?.travaux || "", 180);
  doc.text(travauxLines, marginLeft, currentY);
  currentY += travauxLines.length * 7 + 15;

  // === LIGNE DE SÉPARATION ===
  doc.line(marginLeft, currentY, 195, currentY);
  currentY += 10;

  // === SIGNATURES ===
  const signatureWidth = 60;
  const signatureSpacing = 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Intervenant", marginLeft, currentY);
  doc.text("Client", marginLeft + signatureWidth + signatureSpacing, currentY);
  doc.text("Activ'", marginLeft + (signatureWidth + signatureSpacing) * 2, currentY);

  currentY += 20;

  // Lignes de signature
  doc.line(marginLeft, currentY, marginLeft + signatureWidth, currentY);
  doc.line(
    marginLeft + signatureWidth + signatureSpacing,
    currentY,
    marginLeft + (signatureWidth * 2) + signatureSpacing,
    currentY
  );
  doc.line(
    marginLeft + (signatureWidth + signatureSpacing) * 2,
    currentY,
    marginLeft + (signatureWidth * 3) + (signatureSpacing * 2),
    currentY
  );

  // === SAUVEGARDE ===
  const fileName = `Fiche_Intervention_${intervention?.numero || intervention?.id || "000"}.pdf`;
  doc.save(fileName);
};

import { pdf, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import logo from "../assets/images/activ.png"; // adapte le chemin selon ton projet

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  mainFrame: {
    border: "2pt solid #000",
    padding: 15,
    minHeight: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: -15,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "right",
    marginRight: 50,
  },
  infoBox: {
    border: "1pt solid #000",
    padding: 5,
    width: 150,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  separator: {
    borderBottom: "1pt solid #000",
    marginVertical: 5,
  },
  fieldBlock: {
    borderBottom: "1pt solid #000",
    paddingVertical: 4,
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  fieldLabel: {
    fontWeight: "bold",
    marginBottom: 2,
   
  },
  sectionTitle: {
    backgroundColor: "#031c36ff",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 4,
    marginTop: 10,
  },
  sectionContent: {
    border: "1pt solid #000",
    padding: 8,
    minHeight: 60,
  },
  signatureTable: {
    flexDirection: "row",
    borderTop: "1pt solid #000",
    marginTop: 30,
  },
  signatureCell: {
    flex: 1,
    borderRight: "1pt solid #000",
    minHeight: 80,
    textAlign: "center",
    padding: 8,
  },
  signatureCellLast: {
    flex: 1,
    minHeight: 80,
    textAlign: "center",
    padding: 8,
  },
  signatureHeader: {
    backgroundColor: "#031c36ff",
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 3,
    marginBottom: 5,
  },
  footer: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 15,
    color: "#666",
  },
});

const RapportPDFDocument = ({ rapport, intervention }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateInterventionNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    return `${year}-${month}-${random}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainFrame}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.headerRight}>
              <Text style={styles.headerTitle}>FICHE D’INTERVENTION</Text>
              <View style={styles.infoBox}>
                <Text>
                  <Text style={styles.label}>Numéro :</Text>{" "}
                  {intervention?.id || generateInterventionNumber()}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text>
                  <Text style={styles.label}>Date :</Text>{" "}
                  {formatDate(rapport.date || intervention?.datetime)}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text>
                  <Text style={styles.label}>Horaire :</Text> De{" "}
                  {formatTime(intervention?.startedAt) || "HH:MM"} à{" "}
                  {formatTime(intervention?.endedAt) || "HH:MM"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Informations principales */}
          <View>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Client :</Text>
              <Text>{rapport.client || intervention?.client || "—"}</Text>
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Intervenant :</Text>
              <Text>{rapport.intervenant || intervention?.technicien || "—"}</Text>
            </View>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Type d’intervention :</Text>
              <Text>{rapport.type || "—"}</Text>
            </View>
          </View>

          {/* DEMANDE DU CLIENT */}
          <Text style={styles.sectionTitle}>DEMANDE DU CLIENT</Text>
          <View style={styles.sectionContent}>
            <Text>
              {rapport.description ||
                intervention?.description ||
                "Aucune information fournie."}
            </Text>
          </View>

          {/* OBSERVATION */}
          <Text style={styles.sectionTitle}>OBSERVATION</Text>
          <View style={styles.sectionContent}>
            <Text>{rapport.observation || "Aucune observation"}</Text>
          </View>

          {/* TRAVAUX EFFECTUÉS */}
          <Text style={styles.sectionTitle}>TRAVAUX EFFECTUÉS</Text>
          <View style={styles.sectionContent}>
            <Text>{rapport.travaux || "Aucun travail spécifié"}</Text>
          </View>

          {/* Signatures */}
          <View style={styles.signatureTable}>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureHeader}>INTERVENANT</Text>
              <Text>{rapport.intervenant || "—"}</Text>
            </View>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureHeader}>CLIENT</Text>
              <Text>{rapport.client || "—"}</Text>
            </View>
            <View style={styles.signatureCellLast}>
              <Text style={styles.signatureHeader}>ACTIV'</Text>
              <Text>Signature & Cachet</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Fonction principale
export const generateRapportPDF = async (rapport, intervention) => {
  try {
    const pdfDocument = (
      <RapportPDFDocument rapport={rapport} intervention={intervention} />
    );
    const blob = await pdf(pdfDocument).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const interventionNumber = intervention?.id || "INTERVENTION";
    link.download = `FICHE_INTERVENTION_${interventionNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
  }
};

export default generateRapportPDF;

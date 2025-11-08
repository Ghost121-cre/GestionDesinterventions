import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/images/activ.png";
import { rapportService } from "../services/rapportService";

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
  // Récupérer les heures depuis l'intervention
  const getHeuresIntervention = () => {
    // Vérifiez d'abord dans le rapport, puis dans l'intervention
    if (rapport.heureDebut && rapport.heureFin) {
      return {
        heureDebut: rapport.heureDebut,
        heureFin: rapport.heureFin,
      };
    }
    if (intervention?.heureDebut && intervention?.heureFin) {
      return {
        heureDebut: intervention.heureDebut,
        heureFin: intervention.heureFin,
      };
    }
    return {
      heureDebut: "",
      heureFin: "",
    };
  };

  const heures = getHeuresIntervention();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? ""
        : date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    } catch {
      return "";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    // Si c'est déjà une heure formatée (HH:MM)
    if (typeof timeString === "string" && timeString.includes(":")) {
      return timeString;
    }

    // Si c'est une date/heure complète
    try {
      const date = new Date(timeString);
      return isNaN(date.getTime())
        ? ""
        : date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });
    } catch {
      return "";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainFrame}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.headerRight}>
              <Text style={styles.headerTitle}>FICHE D'INTERVENTION</Text>
              <View style={styles.infoBox}>
                <Text>
                  <Text style={styles.label}>Numéro :</Text>{" "}
                  {intervention?.id || rapport.interventionId || "—"}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text>
                  <Text style={styles.label}>Date :</Text>{" "}
                  {formatDate(rapport.dateRapport || intervention?.datetime)}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text>
                  <Text style={styles.label}>Horaire :</Text>{" "}
                  {heures.heureDebut && heures.heureFin
                    ? `De ${formatTime(heures.heureDebut)} à ${formatTime(
                        heures.heureFin
                      )}`
                    : "Non spécifié"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.separator} />

          {/* Informations principales */}
          <View>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Client :</Text>
              <Text>{rapport.client || intervention?.client?.nom || "—"}</Text>
            </View>

            {/* Section Intervenant(s) */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Intervenant(s) :</Text>
              <Text>
                {rapport.intervenant && rapport.intervenant.length > 0
                  ? rapport.intervenant.join(", ")
                  : intervention?.technicien || "—"}
              </Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Type d'intervention :</Text>
              <Text>{rapport.typeIntervention || "—"}</Text>
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
            <Text>{rapport.observations || "Aucune observation"}</Text>
          </View>

          {/* TRAVAUX EFFECTUÉS */}
          <Text style={styles.sectionTitle}>TRAVAUX EFFECTUÉS</Text>
          <View style={styles.sectionContent}>
            <Text>
              {rapport.travauxEffectues ||
                rapport.travaux ||
                "Aucun travail spécifié"}
            </Text>
          </View>

          {/* Signatures */}
          <View style={styles.signatureTable}>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureHeader}>INTERVENANT</Text>
              <Text>{rapport.intervenant || "—"}</Text>
            </View>
            <View style={styles.signatureCell}>
              <Text style={styles.signatureHeader}>CLIENT</Text>
              <Text>{rapport.client || intervention?.client?.nom || "—"}</Text>
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

export const generateRapportPDF = async (rapport, intervention) => {
  try {
    console.log("🔍 DEBUG - Début de la génération du PDF");
    console.log("🔍 DEBUG - Rapport:", rapport);
    console.log("🔍 DEBUG - Intervention:", intervention);
    console.log("🔍 DEBUG - Type de rapport:", typeof rapport);
    console.log("🔍 DEBUG - Type d'intervention:", typeof intervention);

    // Vérification des données essentielles
    if (!rapport) {
      throw new Error("Le rapport est null ou undefined");
    }

    if (!intervention) {
      console.warn(
        "⚠️ Aucune intervention fournie, utilisation des données du rapport uniquement"
      );
    }

    // 1. Création du document PDF
    console.log("🔍 DEBUG - Création du document PDF...");
    const pdfDocument = (
      <RapportPDFDocument rapport={rapport} intervention={intervention || {}} />
    );

    console.log("🔍 DEBUG - Document PDF créé, génération du blob...");

    // 2. Génération du PDF avec gestion d'erreur spécifique
    let blob;
    try {
      const pdfInstance = pdf(pdfDocument);
      blob = await pdfInstance.toBlob();
      console.log("🔍 DEBUG - Blob généré avec succès, taille:", blob.size);
    } catch (pdfError) {
      console.error("❌ Erreur lors de la génération du blob PDF:", pdfError);
      throw new Error(`Échec de la génération PDF: ${pdfError.message}`);
    }

    // 3. Téléchargement
    console.log("🔍 DEBUG - Préparation du téléchargement...");

    if (typeof window === "undefined") {
      throw new Error("Navigation non disponible (environnement serveur)");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const interventionNumber = intervention?.id || rapport.id || "unknown";
    link.download = `FICHE_INTERVENTION_${interventionNumber}.pdf`;

    console.log("🔍 DEBUG - Téléchargement du fichier:", link.download);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Nettoyage
    setTimeout(() => {
      URL.revokeObjectURL(url);
      console.log("🔍 DEBUG - URL libérée");
    }, 1000);

    console.log("🎉 Rapport PDF généré et téléchargé avec succès!");

    return {
      success: true,
      rapportId: rapport.id,
      fileName: link.download,
    };
  } catch (error) {
    console.error("❌ ERREUR DÉTAILLÉE - Génération PDF échouée:");
    console.error("🔍 Message:", error.message);
    console.error("🔍 Stack:", error.stack);
    console.error("🔍 Type:", typeof error);

    // Message d'erreur utilisateur plus clair
    let userMessage = "Erreur lors de la génération du PDF";

    if (
      error.message.includes("container") ||
      error.message.includes("document")
    ) {
      userMessage =
        "Erreur technique: environnement de génération PDF non supporté";
    } else if (error.message.includes("blob")) {
      userMessage = "Erreur lors de la création du fichier PDF";
    } else if (error.message.includes("navigation")) {
      userMessage = "Impossible de télécharger le PDF dans cet environnement";
    }

    throw new Error(userMessage);
  }
};

import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Création des styles basés sur ton modèle PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  table: {
    marginBottom: 15,
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 20,
  },
  tableCellLabel: {
    width: '40%',
    padding: 5,
    fontWeight: 'bold',
    borderRight: '1pt solid #000',
  },
  tableCellValue: {
    width: '60%',
    padding: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  checkboxGroup: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '1pt solid #000',
    marginRight: 5,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    border: '1pt solid #000',
    marginRight: 5,
    backgroundColor: '#000',
  },
  signatureTable: {
    marginTop: 40,
    width: '100%',
  },
  signatureRow: {
    flexDirection: 'row',
    borderTop: '1pt solid #000',
  },
  signatureCell: {
    flex: 1,
    padding: 10,
    borderRight: '1pt solid #000',
    textAlign: 'center',
    minHeight: 80,
  },
  signatureCellLast: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    minHeight: 80,
  },
  separator: {
    borderBottom: '1pt solid #000',
    marginVertical: 10,
  },
  contentSection: {
    marginBottom: 10,
    padding: 8,
    border: '1pt solid #e0e0e0',
    minHeight: 60,
  },
  contentText: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoColumn: {
    width: '32%',
  },
});

// Composant PDF pour le rapport d'intervention
const RapportPDFDocument = ({ rapport, intervention }) => {
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Générer le numéro d'intervention
  const generateInterventionNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${year}-${month}-${random}`;
  };

  // Déterminer le type d'intervention sélectionné
  const getSelectedInterventionType = (type) => {
    const types = ['Support', 'Maintenance', 'Installation', 'Formation'];
    return types.includes(type) ? type : 'Support';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <Text style={styles.header}>Activ' FICHE D'INTERVENTION</Text>

        {/* Tableau d'informations générales */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Numéro</Text>
            </View>
            <View style={styles.tableCellValue}>
              <Text>: {intervention?.id ? `2025-10-${String(intervention.id).padStart(3, '0')}` : generateInterventionNumber()}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Date</Text>
            </View>
            <View style={styles.tableCellValue}>
              <Text>: {formatDate(rapport.date || intervention?.datetime)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Horaire (Début – Fin)</Text>
            </View>
            <View style={styles.tableCellValue}>
              <Text>: De {formatTime(intervention?.startedAt) || 'HH:MM'} À {formatTime(intervention?.endedAt) || 'HH:MM'}</Text>
            </View>
          </View>
        </View>

        {/* Séparateur */}
        <View style={styles.separator} />

        {/* Section CLIENT - INTERVENANT - TYPE D'INTERVENTION */}
        <View style={styles.infoGrid}>
          {/* CLIENT */}
          <View style={styles.infoColumn}>
            <Text style={styles.subsectionTitle}>CLIENT</Text>
            <Text style={styles.contentText}>{rapport.client || intervention?.client || ''}</Text>
            <Text style={styles.contentText}>{intervention?.produit || ''}</Text>
            <Text style={styles.contentText}>
              {intervention?.description ? `${intervention.description.substring(0, 50)}...` : ''}
            </Text>
          </View>

          {/* INTERVENANT */}
          <View style={styles.infoColumn}>
            <Text style={styles.subsectionTitle}>INTERVENANT</Text>
            <Text style={styles.contentText}>{rapport.intervenant || intervention?.technicien || ''}</Text>
            <Text style={styles.contentText}>{rapport.type || ''}</Text>
          </View>

          {/* TYPE D'INTERVENTION */}
          <View style={styles.infoColumn}>
            <Text style={styles.subsectionTitle}>TYPE D'INTERVENTION</Text>
            {['Support', 'Maintenance', 'Installation', 'Formation'].map((type) => (
              <View key={type} style={styles.checkboxGroup}>
                <View style={getSelectedInterventionType(rapport.type) === type ? styles.checkboxChecked : styles.checkbox} />
                <Text>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section DEMANDE DU CLIENT */}
        <Text style={styles.sectionTitle}>DEMANDE DU CLIENT</Text>
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>
            {rapport.description || intervention?.description || 'Aucune information'}
          </Text>
        </View>

        {/* Section OBSERVATION */}
        <Text style={styles.sectionTitle}>OBSERVATION</Text>
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>
            {rapport.observation || 'Aucune observation'}
          </Text>
        </View>

        {/* Section TRAVAUX EFFECTUES */}
        <Text style={styles.sectionTitle}>TRAVAUX EFFECTUES</Text>
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>
            {rapport.travaux || 'Aucun travail spécifié'}
          </Text>
        </View>

        {/* Tableau des signatures */}
        <View style={styles.signatureTable}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureCell}>
              <Text>Intervenant</Text>
              <Text style={{ marginTop: 30 }}>{rapport.intervenant || ''}</Text>
            </View>
            <View style={styles.signatureCell}>
              <Text>Client</Text>
              <Text style={{ marginTop: 30 }}>{rapport.client || ''}</Text>
            </View>
            <View style={styles.signatureCellLast}>
              <Text>Activ'</Text>
              <Text style={{ marginTop: 30 }}>Signature & Cachet</Text>
            </View>
          </View>
        </View>

        {/* Pied de page avec date de génération */}
        <Text style={{ 
          fontSize: 8, 
          textAlign: 'center', 
          marginTop: 20,
          color: '#666'
        }}>
          Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
        </Text>
      </Page>
    </Document>
  );
};

// Fonction principale pour générer et télécharger le PDF
export const generateRapportPDF = async (rapport, intervention) => {
  try {
    // Créer le document PDF
    const pdfDocument = <RapportPDFDocument rapport={rapport} intervention={intervention} />;
    
    // Générer le blob PDF
    const blob = await pdf(pdfDocument).toBlob();
    
    // Créer l'URL et déclencher le téléchargement
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Nom du fichier
    const interventionNumber = intervention?.id ? `2025-10-${String(intervention.id).padStart(3, '0')}` : 'INTERVENTION';
    link.download = `INTERVENTION ${interventionNumber}.pdf`;
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('Échec de la génération du PDF');
  }
};

// Fonction pour générer le PDF sans le télécharger (pour prévisualisation)
export const generateRapportPDFBlob = async (rapport, intervention) => {
  try {
    const pdfDocument = <RapportPDFDocument rapport={rapport} intervention={intervention} />;
    const blob = await pdf(pdfDocument).toBlob();
    return blob;
  } catch (error) {
    console.error('Erreur lors de la génération du blob PDF:', error);
    throw error;
  }
};

export default generateRapportPDF;
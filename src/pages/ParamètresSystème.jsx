import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import { 
  cilCog, 
  cilBell, 
  cilCalendar,
  cilEnvelopeOpen,
  cilGlobeAlt,
  cilSave,
  cilReload
} from "@coreui/icons";
import styles from "../assets/css/ParamètresSystème.module.css";

function ParamètresSystème() {
  const [settings, setSettings] = useState({
    // Général
    nomApplication: "Gestion Interventions",
    langue: "fr",
    fuseauHoraire: "Europe/Paris",
    
    // Notifications
    notifEmail: true,
    notifSMS: false,
    notifIntervention: true,
    notifRappel: true,
    
    // Calendrier
    debutHeure: "08:00",
    finHeure: "18:00",
    dureeDefaut: "60",
    
    // Interface
    themeAuto: true,
    densite: "normal",
    animations: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simulation sauvegarde
    console.log("Sauvegarde des paramètres:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings({
      nomApplication: "Gestion Interventions",
      langue: "fr",
      fuseauHoraire: "Europe/Paris",
      notifEmail: true,
      notifSMS: false,
      notifIntervention: true,
      notifRappel: true,
      debutHeure: "08:00",
      finHeure: "18:00",
      dureeDefaut: "60",
      themeAuto: true,
      densite: "normal",
      animations: true
    });
  };

  return (
    <div className={styles.pageContainer}>
      <Container className={styles.container}>
        {/* En-tête */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <CIcon icon={cilCog} className={styles.titleIcon} />
              Paramètres Système
            </h1>
            <p className={styles.subtitle}>
              Configuration avancée du système et des préférences
            </p>
          </div>
        </div>

        {saved && (
          <Alert variant="success" className={styles.alert}>
            Paramètres sauvegardés avec succès !
          </Alert>
        )}

        <Row className="g-4">
          {/* Général */}
          <Col lg={6}>
            <Card className={styles.settingsCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilCog} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Général</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Nom de l'application</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.nomApplication}
                    onChange={(e) => handleChange('nomApplication', e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Langue</Form.Label>
                  <Form.Select
                    value={settings.langue}
                    onChange={(e) => handleChange('langue', e.target.value)}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fuseau horaire</Form.Label>
                  <Form.Select
                    value={settings.fuseauHoraire}
                    onChange={(e) => handleChange('fuseauHoraire', e.target.value)}
                  >
                    <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Notifications */}
          <Col lg={6}>
            <Card className={styles.settingsCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilBell} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Notifications</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Notifications par email"
                    checked={settings.notifEmail}
                    onChange={(e) => handleChange('notifEmail', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Notifications SMS"
                    checked={settings.notifSMS}
                    onChange={(e) => handleChange('notifSMS', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Nouvelles interventions"
                    checked={settings.notifIntervention}
                    onChange={(e) => handleChange('notifIntervention', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Rappels automatiques"
                    checked={settings.notifRappel}
                    onChange={(e) => handleChange('notifRappel', e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Calendrier */}
          <Col lg={6}>
            <Card className={styles.settingsCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilCalendar} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Calendrier</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Heure de début</Form.Label>
                      <Form.Control
                        type="time"
                        value={settings.debutHeure}
                        onChange={(e) => handleChange('debutHeure', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Heure de fin</Form.Label>
                      <Form.Control
                        type="time"
                        value={settings.finHeure}
                        onChange={(e) => handleChange('finHeure', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Durée par défaut (minutes)</Form.Label>
                  <Form.Select
                    value={settings.dureeDefaut}
                    onChange={(e) => handleChange('dureeDefaut', e.target.value)}
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Interface */}
          <Col lg={6}>
            <Card className={styles.settingsCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilGlobeAlt} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Interface</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Thème automatique"
                    checked={settings.themeAuto}
                    onChange={(e) => handleChange('themeAuto', e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Densité d'affichage</Form.Label>
                  <Form.Select
                    value={settings.densite}
                    onChange={(e) => handleChange('densite', e.target.value)}
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="comfortable">Confortable</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Animations"
                    checked={settings.animations}
                    onChange={(e) => handleChange('animations', e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actions */}
        <Card className={styles.actionsCard}>
          <Card.Body className={styles.actionsBody}>
            <div className={styles.actionsButtons}>
              <Button 
                variant="outline-secondary" 
                onClick={handleReset}
                className={styles.resetBtn}
              >
                <CIcon icon={cilReload} className={styles.btnIcon} />
                Réinitialiser
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
                className={styles.saveBtn}
              >
                <CIcon icon={cilSave} className={styles.btnIcon} />
                Sauvegarder les paramètres
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ParamètresSystème;
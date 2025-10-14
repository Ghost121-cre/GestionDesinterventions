import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from "react-bootstrap";
import CIcon from "@coreui/icons-react";
import { 
  cilShieldAlt, 
  cilLockLocked, 
  cilUser,
  cilHistory,
  cilCheck,
  cilWarning
} from "@coreui/icons";
import styles from "../assets/css/Sécurité.module.css";

function Sécurité() {
  const [security, setSecurity] = useState({
    // Authentification
    forceMotDePasse: "moyen",
    expirationMotDePasse: 90,
    tentativesMax: 5,
    verrouillageCompte: true,
    
    // Session
    dureeSession: 30,
    reconnexionAuto: false,
    
    // 2FA
    deuxFacteurs: false,
    methode2FA: "email",
    
    // Audit
    journalisation: true,
    notificationsConnexion: true
  });

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Sauvegarde sécurité:", security);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const forceMotDePasseOptions = [
    { value: "faible", label: "Faible (6 caractères)", color: "danger" },
    { value: "moyen", label: "Moyen (8 caractères, chiffres)", color: "warning" },
    { value: "fort", label: "Fort (12 caractères, mixte)", color: "success" },
    { value: "tres-fort", label: "Très fort (16 caractères, spéciaux)", color: "primary" }
  ];

  const getForceLabel = (force) => {
    const option = forceMotDePasseOptions.find(opt => opt.value === force);
    return option ? option.label : "Inconnu";
  };

  const getForceColor = (force) => {
    const option = forceMotDePasseOptions.find(opt => opt.value === force);
    return option ? option.color : "secondary";
  };

  return (
    <div className={styles.pageContainer}>
      <Container className={styles.container}>
        {/* En-tête */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <CIcon icon={cilShieldAlt} className={styles.titleIcon} />
              Sécurité
            </h1>
            <p className={styles.subtitle}>
              Gérez la sécurité et les politiques d'authentification
            </p>
          </div>
        </div>

        {saved && (
          <Alert variant="success" className={styles.alert}>
            Paramètres de sécurité sauvegardés !
          </Alert>
        )}

        <Row className="g-4">
          {/* Authentification */}
          <Col lg={6}>
            <Card className={styles.securityCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilLockLocked} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Authentification</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Force des mots de passe</Form.Label>
                  <div className={styles.forceIndicator}>
                    <span className={`${styles.forceBadge} ${styles[getForceColor(security.forceMotDePasse)]}`}>
                      {getForceLabel(security.forceMotDePasse)}
                    </span>
                  </div>
                  <Form.Select
                    value={security.forceMotDePasse}
                    onChange={(e) => handleChange('forceMotDePasse', e.target.value)}
                  >
                    {forceMotDePasseOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Expiration des mots de passe (jours)</Form.Label>
                  <Form.Select
                    value={security.expirationMotDePasse}
                    onChange={(e) => handleChange('expirationMotDePasse', parseInt(e.target.value))}
                  >
                    <option value={30}>30 jours</option>
                    <option value={60}>60 jours</option>
                    <option value={90}>90 jours</option>
                    <option value={180}>180 jours</option>
                    <option value={365}>1 an</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tentatives de connexion maximum</Form.Label>
                  <Form.Select
                    value={security.tentativesMax}
                    onChange={(e) => handleChange('tentativesMax', parseInt(e.target.value))}
                  >
                    <option value={3}>3 tentatives</option>
                    <option value={5}>5 tentatives</option>
                    <option value={10}>10 tentatives</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Verrouillage de compte après échecs"
                    checked={security.verrouillageCompte}
                    onChange={(e) => handleChange('verrouillageCompte', e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Session */}
          <Col lg={6}>
            <Card className={styles.securityCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilUser} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Gestion des Sessions</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Durée de session (minutes)</Form.Label>
                  <Form.Select
                    value={security.dureeSession}
                    onChange={(e) => handleChange('dureeSession', parseInt(e.target.value))}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={120}>2 heures</option>
                    <option value={480}>8 heures</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Reconnexion automatique"
                    checked={security.reconnexionAuto}
                    onChange={(e) => handleChange('reconnexionAuto', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Permet aux utilisateurs de rester connectés
                  </Form.Text>
                </Form.Group>

                <div className={styles.sessionInfo}>
                  <CIcon icon={cilWarning} className={styles.infoIcon} />
                  <small>La session expire après {security.dureeSession} minutes d'inactivité</small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Authentification à deux facteurs */}
          <Col lg={6}>
            <Card className={styles.securityCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilShieldAlt} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Double Authentification</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Activer la double authentification"
                    checked={security.deuxFacteurs}
                    onChange={(e) => {
                      handleChange('deuxFacteurs', e.target.checked);
                      if (e.target.checked) setShow2FAModal(true);
                    }}
                  />
                  <Form.Text className="text-muted">
                    Ajoute une couche de sécurité supplémentaire
                  </Form.Text>
                </Form.Group>

                {security.deuxFacteurs && (
                  <Form.Group className="mb-3">
                    <Form.Label>Méthode d'authentification</Form.Label>
                    <Form.Select
                      value={security.methode2FA}
                      onChange={(e) => handleChange('methode2FA', e.target.value)}
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="app">Application d'authentification</option>
                    </Form.Select>
                  </Form.Group>
                )}

                {security.deuxFacteurs && (
                  <Alert variant="info" className={styles.infoAlert}>
                    <CIcon icon={cilCheck} className={styles.alertIcon} />
                    La double authentification est activée pour tous les utilisateurs
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Audit et Journalisation */}
          <Col lg={6}>
            <Card className={styles.securityCard}>
              <Card.Header className={styles.cardHeader}>
                <CIcon icon={cilHistory} className={styles.sectionIcon} />
                <h5 className={styles.sectionTitle}>Audit et Surveillance</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Journalisation des activités"
                    checked={security.journalisation}
                    onChange={(e) => handleChange('journalisation', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Enregistre toutes les actions importantes
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="Notifications de connexion"
                    checked={security.notificationsConnexion}
                    onChange={(e) => handleChange('notificationsConnexion', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Alertes pour les nouvelles connexions
                  </Form.Text>
                </Form.Group>

                <div className={styles.auditStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>1,248</span>
                    <span className={styles.statLabel}>Connexions ce mois</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>3</span>
                    <span className={styles.statLabel}>Alertes sécurité</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actions */}
        <Card className={styles.actionsCard}>
          <Card.Body className={styles.actionsBody}>
            <div className={styles.securityLevel}>
              <CIcon icon={cilShieldAlt} className={styles.shieldIcon} />
              <div className={styles.levelInfo}>
                <h6>Niveau de sécurité: Élevé</h6>
                <small>Tous les paramètres recommandés sont activés</small>
              </div>
            </div>
            <div className={styles.actionsButtons}>
              <Button 
                variant="primary" 
                onClick={handleSave}
                className={styles.saveBtn}
              >
                <CIcon icon={cilLockLocked} className={styles.btnIcon} />
                Appliquer la politique de sécurité
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Modal 2FA */}
        <Modal show={show2FAModal} onHide={() => setShow2FAModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <CIcon icon={cilShieldAlt} /> Activation 2FA
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>La double authentification va être activée pour tous les utilisateurs.</p>
            <p>Ils devront configurer leur méthode d'authentification à leur prochaine connexion.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow2FAModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setShow2FAModal(false)}>
              Confirmer
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Sécurité;
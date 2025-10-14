import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { 
  cilCog, 
  cilStorage, 
  cilUser, 
  cilPeople,
  cilSettings,
  cilShieldAlt
} from "@coreui/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../assets/css/Paramètres.module.css";

function Parametres() {
  const settingsCards = [
    { 
      title: "Gestion des Produits", 
      description: "Gérez votre catalogue de produits et services",
      icon: cilStorage, 
      link: "/produit",
      color: "primary",
      count: 12 // Exemple de métrique
    },
    { 
      title: "Gestion des Clients", 
      description: "Administrez votre base de données clients",
      icon: cilUser, 
      link: "/client",
      color: "success",
      count: 48
    },
    { 
      title: "Comptes Utilisateurs", 
      description: "Gérez les accès et permissions des utilisateurs",
      icon: cilPeople, 
      link: "/compte_utilisateur",
      color: "warning",
      count: 8
    },
  ];

  const getCardClass = (color) => {
    const colorMap = {
      primary: styles.cardPrimary,
      success: styles.cardSuccess,
      warning: styles.cardWarning,
      info: styles.cardInfo,
      danger: styles.cardDanger
    };
    return colorMap[color] || styles.cardPrimary;
  };

  return (
    <div className={styles.pageContainer}>
      <Container className={styles.container}>
        {/* En-tête */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <CIcon icon={cilCog} className={styles.titleIcon} />
              Paramètres du Système
            </h1>
            <p className={styles.subtitle}>
              Configurez et gérez tous les aspects de votre application
            </p>
          </div>
        </div>

        {/* Grille des cartes */}
        <Row className="g-4 justify-content-center">
          {settingsCards.map((card, index) => (
            <Col key={index} xs={12} sm={6} lg={4} className="d-flex justify-content-center">
              <Card className={`${styles.settingsCard} ${getCardClass(card.color)}`}>
                <Card.Body className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      <CIcon icon={card.icon} className={styles.icon} />
                    </div>
                    {card.count !== null && (
                      <div className={styles.cardBadge}>
                        {card.count}
                      </div>
                    )}
                  </div>
                  
                  <Card.Title className={styles.cardTitle}>
                    {card.title}
                  </Card.Title>
                  
                  <Card.Text className={styles.cardDescription}>
                    {card.description}
                  </Card.Text>

                  <div className={styles.cardFooter}>
                    <Link 
                      to={card.link} 
                      className={styles.cardLink}
                    >
                      <span>Configurer</span>
                      <CIcon icon={cilCog} className={styles.linkIcon} />
                    </Link>
                  </div>
                </Card.Body>
                
                {/* Effet de bordure colorée */}
                <div className={styles.cardBorder}></div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Section statistiques rapides */}
        <div className={styles.quickStats}>
          <Row className="g-3">
            <Col xs={6} md={3}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>12</div>
                <div className={styles.statLabel}>Produits</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>48</div>
                <div className={styles.statLabel}>Clients</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>8</div>
                <div className={styles.statLabel}>Utilisateurs</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>156</div>
                <div className={styles.statLabel}>Interventions</div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Parametres;


  

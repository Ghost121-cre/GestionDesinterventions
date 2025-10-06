import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../assets/css/Paramètres.css";

import Produit from "../assets/images/SIB.png";
import Client from "../assets/images/Client.png";
import CompteUser from "../assets/images/use.png";

function Parametres() {
  const cards = [
    { title: "Produit", image: Produit, link: "/produit" },
    { title: "Client", image: Client, link: "/client" },
    { title: "Compte Utilisateur", image: CompteUser, link: "/compte_utilisateur" },
  ];

  return (
    <Container className="parametres-container mt-5">
      <h2 className="text-center mb-4 fw-bold titre-page">Paramètres</h2>
      <Row className="g-4 justify-content-center">
        {cards.map((card, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
            <Card className="param-card text-center">
              <div className="card-img-container">
                <Card.Img src={card.image} alt={card.title} className="card-img-top" />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>{card.title}</Card.Title>
                <Button as={Link} to={card.link} className="bouton w-100 mt-3">
                  Accéder
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Parametres;

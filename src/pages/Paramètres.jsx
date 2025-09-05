import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import "../assets/css/Paramètres.css";
import { Link } from "react-router-dom";

import CompteUser from "../assets/images/use.png";
import Produit from "../assets/images/SIB.png";
import incident from "../assets/images/incident.jpg";
import Client from "../assets/images/Client.png";

function Parametres() {
  return (
    <Container className="mt-4">
      <Row>
        {/* Première carte */}
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={Produit} className="card-img-top" />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Produit</Card.Title>
              <div className="mt-auto">
                <Button as={Link} to="/produit" className="bouton">Accéder</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Deuxième carte */}
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={Client} className="card-img-top" />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Client</Card.Title>
              <div className="mt-auto">
                <Button as={Link} to="/client" className="bouton">Accéder</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Troisième carte */}
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={CompteUser} className="card-img-top" />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Compte Utilisateur</Card.Title>
              <div className="mt-auto">
                <Button as={Link} to="/compte_utilisateur" className="bouton">Accéder</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Quatrième carte */}
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={incident} className="card-img-top" />
            <Card.Body className="d-flex flex-column">
              <Card.Title>Incident</Card.Title>
              <div className="mt-auto">
                <Button as={Link} to="/incident" className="bouton">Accéder</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Parametres;

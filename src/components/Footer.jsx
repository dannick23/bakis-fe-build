import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSystem } from "../App";

const Footer = () => {
  const year = new Date().getFullYear();
  const { system } = useSystem();
  return (
    <footer className="mt-auto">
      <Container fluid={true}>
        <Row className="border-top justify-content-between p-3">
          <Col className="p-0" md={3} sm={12}>
            {system.charAt(0).toUpperCase() +
              system.slice(1).replaceAll("-", " ")}
          </Col>
          <Col className="p-0 d-flex justify-content-end" md={3}>
            This site was made by Me.
          </Col>
          <Col className="p-0 d-flex justify-content-end" md={3}>
            © {year}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

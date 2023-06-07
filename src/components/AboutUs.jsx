import React, { useState, useEffect } from "react";
import { fetchAboutUs } from "../functions/BackedClient";
import { useSystem } from "../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const AboutUs = () => {
  const { system } = useSystem();
  const [aboutUs, setAboutUs] = useState("");

  useEffect(() => {
    const fetchAboutUsText = async () => {
      const fetchedAboutUs = await fetchAboutUs(system);
      setAboutUs(fetchedAboutUs || "");
    };
    fetchAboutUsText();
  }, [system]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>
                <h1>About Us</h1>
              </Card.Title>
              <Card.Text>{aboutUs}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;

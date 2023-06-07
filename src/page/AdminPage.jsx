import React from "react";
import ImageUpload from "../components/ImageUpload";
import AdminCollage from "../components/AdminCollage";
import ChangeAboutUs from "../components/ChangeAboutUs";
import ChangeDescription from "../components/ChangeDescription";
import ShiftChange from "../components/ShiftChange";
import { Container, Row, Col, Card } from "react-bootstrap";
import UnconfirmedWorkers from "../components/UnconfirmedWorkers";

const AdminPage = () => (
  <Container fluid>
    <Row className="mb-3">
      <Col>
        <Card className="mt-3 shadow-sm">
          <Card.Body className="p-3">
            <ImageUpload />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Card className="mt-3 shadow-sm">
          <Card.Body className="p-3">
            <AdminCollage />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Card className="mt-3 shadow-sm">
          <Card.Body className="p-3">
            <ChangeAboutUs />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Card className="mt-3 shadow-sm">
          <Card.Body className="p-3">
            <ChangeDescription />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Card className="mt-3 shadow-sm">
          <Card.Body className="p-3">
            <ShiftChange />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Card className="mt-3 shadow-sm">
          <Card.Body className="p-3">
            <UnconfirmedWorkers />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default AdminPage;

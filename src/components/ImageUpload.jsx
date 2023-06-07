import React, { useState } from "react";
import { useSystem } from "../App";
import { uploadFile } from "../functions/BackedClient";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useAuthHeader } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

function ImageUpload() {
  const { system } = useSystem();
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
  });
  const authHeader = useAuthHeader();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    const response = await uploadFile(formData, system, authHeader());
    setShowModal(true);
    if (response.status === 200) {
      setModalContent({
        title: "Success",
        message: "Your file was uploaded successfully",
      });
    } else {
      setModalContent({
        title: "Error",
        message: "There was an error uploading your file",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(`/${system}/admin-menu`);
  };

  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <h2>Upload an image to the collage</h2>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  maxLength="128"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  maxLength="512"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Upload File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Upload
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ImageUpload;

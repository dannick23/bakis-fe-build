import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { fetchImageIds } from "../functions/BackedClient";
import axios from "axios";
import { useSystem } from "../App";
import { useAuthHeader } from "react-auth-kit";

const AdminCollage = () => {
  const { system } = useSystem();
  const [images, setImages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const authHeader = useAuthHeader();

  useEffect(() => {
    const fetchImages = async () => {
      const imagesFromServer = await fetchImageIds(system);
      setImages(imagesFromServer);
    };
    fetchImages();
  }, [system]);

  const handleClickImage = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `{process.env.BE_HOST}/system/${system}/delete-image/${id}`,
      {
        headers: {
          Authorization: authHeader(),
        },
      }
    );
    setImages(images.filter((image) => image.id !== id));
    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
  };

  return (
    <Row className="mt-4">
      <h2>Administrative photo collage</h2>
      {images &&
        images.map((image, index) => (
          <Col sm={6} md={4} lg={3} className="mb-4" key={index}>
            <Card
              className={`h-100 shadow-sm bg-white rounded ${
                selectedIds.includes(image.id) ? "border-primary" : ""
              }`}
            >
              <Card.Img
                variant="top"
                src={`{process.env.BE_HOST}/system/${system}/get-image/${image.id}`}
                onClick={() => handleClickImage(image.id)}
                className={selectedIds.includes(image.id) ? "opacity-50" : ""}
              />
              <Button variant="danger" onClick={() => handleDelete(image.id)}>
                Delete
              </Button>
            </Card>
          </Col>
        ))}
      <Col sm={12}>
        <Card className="mt-4">
          <Card.Body></Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminCollage;

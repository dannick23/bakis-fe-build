import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { fetchImageIds } from "../functions/BackedClient";
import { useSystem } from "../App";
import { fetchDescription } from "../functions/BackedClient";

function PhotoCollage() {
  const util = require("util");
  const { system } = useSystem();
  const [images, setImages] = useState([
    {
      id: null,
      name: "",
      description: "",
    },
  ]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchImagesAndDescription = async () => {
      const images = await fetchImageIds(system);
      setImages(images);

      const fetchedDescription = await fetchDescription(system);
      console.log(util.inspect(fetchedDescription, false, null, true));
      setDescription(fetchDescription && fetchedDescription.description);
    };
    fetchImagesAndDescription();
  }, [system]);

  return (
    <Row className="mt-4">
      {images &&
        images.map((image) => (
          <Col sm={6} md={4} lg={3} className="mb-4" key={image.id}>
            <Card className="h-100 shadow-sm bg-white rounded">
              {" "}
              <Card.Img
                variant="top"
                src={`{process.env.BE_HOST}/system/${system}/get-image/${image.id}`}
              />
              <Card.Body className="d-flex flex-column">
                {" "}
                <div className="d-flex mb-2 justify-content-between">
                  <Card.Title className="mb-0 font-weight-bold">
                    {image.name}
                  </Card.Title>{" "}
                </div>
                <Card.Text className="text-secondary">
                  {image.description}
                </Card.Text>{" "}
              </Card.Body>
            </Card>
          </Col>
        ))}
      <Col sm={12}>
        <Card className="mt-4">
          <Card.Body>
            <Card.Title className="mb-0 font-weight-bold">{system}</Card.Title>
            <Card.Text className="text-secondary">{description}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default PhotoCollage;

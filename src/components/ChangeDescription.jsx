import React, { useState } from "react";
import axios from "axios";
import { useSystem } from "../App";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useAuthHeader } from "react-auth-kit";

function ChangeDescription() {
  const [newText, setNewText] = useState("");
  const { system } = useSystem();
  const authHeader = useAuthHeader();

  const handleChange = (event) => {
    setNewText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `https://bakis-be.herokuapp.com/system/${system}/change-description`,
        { description: newText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader()
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Container className="mt-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="about-us">
          <Form.Label>Change description:</Form.Label>
          <Form.Control
            as="textarea"
            value={newText}
            onChange={handleChange}
            maxLength={512}
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default ChangeDescription;

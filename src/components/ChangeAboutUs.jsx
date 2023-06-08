import React, { useState } from "react";
import axios from "axios";
import { useSystem } from "../App";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useAuthHeader } from "react-auth-kit";

function ChangeAboutUs() {
  const [newText, setNewText] = useState("");
  const { system } = useSystem();
  const authHeader = useAuthHeader();

  const handleChange = (event) => {
    setNewText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(
      `https://bakis-be.herokuapp.com/system/${system}/change-about-us`,
      newText,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader(),
        },
      }
    );
    console.log(response.data);
  };

  return (
    <Container className="mt-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="about-us">
          <Form.Label>Change about us:</Form.Label>
          <Form.Control as="textarea" value={newText} onChange={handleChange} />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default ChangeAboutUs;

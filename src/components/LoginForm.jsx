import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useSystem } from "../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useSignIn, useAuthHeader } from "react-auth-kit";
import axios from "axios";

const LoginForm = () => {
  const { system, user, setUser } = useSystem();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const util = require("util");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://bakis-be.herokuapp.com/user/${system}/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const userDetails = response.data;
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        description,
        authority,
        jwtToken,
      } = userDetails;

      signIn({
        token: jwtToken,
        expiresIn: 1440,
        tokenType: "Bearer",
        authState: { email: email, authority: authority },
      });

      const userResponse = {
        firstName,
        lastName,
        email,
        phoneNumber,
        description,
        authority,
      };
      setUser(userResponse);
      setError("");
      navigate(`/${system}/home`);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col md={6}>
          <Form
            onSubmit={submitForm}
            className="p-5 border shadow-lg rounded bg-light"
          >
            {error && <p className="text-danger">{error}</p>}{" "}
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={data.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" disabled={isLoading} className="w-100">
              {" "}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center mt-3">
              <Link to="/register">Don't have an account? Register</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;

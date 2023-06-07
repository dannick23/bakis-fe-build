import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { submitData } from "../functions/RegistrationFunc";
import { useSystem } from "../App";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Alert from "react-bootstrap/Alert";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const { system, setUser } = useSystem();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    description: "",
    authority: "CLIENT",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const signIn = useSignIn();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await submitData(form, system);
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

      const user = {
        firstName,
        lastName,
        email,
        phoneNumber,
        description,
        authority,
      };
      setUser(user);
      setShowModal(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate(`/${system}/home`);
  };

  const passwordTooltip = (props) => (
    <Tooltip id="password-tooltip" {...props}>
      Password must contain at least 8 symbols and 1 digit
    </Tooltip>
  );

  const isEmailValid = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(form.email);
  };

  const isPasswordValid = () => {
    const re = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return re.test(form.password);
  };

  const isFirstNameValid = () => {
    const re = /^[A-Za-z]+$/;
    return re.test(form.firstName);
  };

  const isLastNameValid = () => {
    const re = /^[A-Za-z]+$/;
    return re.test(form.lastName);
  };

  const isPhoneNumberValid = () => {
    const re = /^(8[536]\d{7}|\+370[536]\d{7})$/;
    return re.test(form.phoneNumber);
  };

  const isFormValid = () => isEmailValid() && isPasswordValid();
  return (
    <Container className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col md={6}>
          <Form
            onSubmit={handleSubmit}
            className="p-5 border shadow-lg rounded bg-light"
          >
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter First Name"
                value={form.firstName}
                onChange={handleChange}
                isInvalid={!isFirstNameValid() && form.firstName !== ""}
              />
              <Form.Control.Feedback type="invalid">
                First name can not be empty or have numbers!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter Last Name"
                value={form.lastName}
                onChange={handleChange}
                isInvalid={!isLastNameValid() && form.firstName !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Last name can not be empty or have numbers!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                isInvalid={!isEmailValid() && form.email !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={passwordTooltip}
              >
                <Form.Label>Password</Form.Label>
              </OverlayTrigger>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                isInvalid={!isPasswordValid() && form.password !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Password must contain at least 8 symbols and 1 digit.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                isInvalid={!isPhoneNumberValid() && form.phoneNumber !== ""}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid phone number!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Authority</Form.Label>
              <Form.Control
                as="select"
                name="authority"
                value={form.authority}
                onChange={handleChange}
              >
                <option value="CLIENT">Client</option>
                <option value="WORKER">Worker</option>
              </Form.Control>
            </Form.Group>

            {form.authority === "WORKER" && (
              <>
                {" "}
                <Alert variant="info">
                  The system's administrator will need to approve your
                  registration request before you can use the account.
                </Alert>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Enter Description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )}

            <Button type="submit" disabled={isLoading} className="w-100">
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </Form>
          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Registration Successful</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your registration was successful!</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleModalClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;

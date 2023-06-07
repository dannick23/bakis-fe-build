import { useState, useEffect } from "react";
import { Button, Form, Container } from "react-bootstrap";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { useSystem } from "../App";

const ShiftChange = () => {
  const [shiftDetails, setShiftDetails] = useState({
    from: "",
    to: "",
    type: "REGULAR",
  });
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerEmail, setSelectedWorkerEmail] = useState("");
  const { system } = useSystem();
  const authHeader = useAuthHeader();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          `{process.env.BE_HOST}/system/${system}/all-workers`,
          {
            headers: { Authorization: authHeader() },
          }
        );
        setWorkers(response.data);
        setSelectedWorkerEmail(response.data[0]?.email);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkers();
  }, [system]);

  const handleChange = (event) => {
    setShiftDetails({
      ...shiftDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `{process.env.BE_HOST}/worker/${system}/change-shift/${selectedWorkerEmail}`,
        shiftDetails,
        { headers: { Authorization: authHeader() } }
      );
      if (response.status === 200) {
        alert("Shift change successful");
      }
    } catch (error) {
      alert("Shift change failed");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="workerSelect">
          <Form.Label>Worker shift change request</Form.Label>
          <Form.Control
            as="select"
            name="worker"
            value={selectedWorkerEmail}
            onChange={(event) => setSelectedWorkerEmail(event.target.value)}
            required
          >
            {workers.map((worker) => (
              <option key={worker.email} value={worker.email}>
                {worker.firstName} {worker.lastName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="from">
          <Form.Label>From</Form.Label>
          <Form.Control
            type="datetime-local"
            name="from"
            value={shiftDetails.from}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="to">
          <Form.Label>To</Form.Label>
          <Form.Control
            type="datetime-local"
            name="to"
            value={shiftDetails.to}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            name="type"
            value={shiftDetails.type}
            onChange={handleChange}
            required
          >
            <option value="REGULAR">Regular</option>
            <option value="OVERTIME">Overtime</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default ShiftChange;

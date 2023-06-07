import { useState, useEffect } from "react";
import { Button, ListGroup, Container } from "react-bootstrap";
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { useSystem } from "../App";
import { useNavigate } from "react-router-dom";

const UnconfirmedWorkers = () => {
  const [unconfirmedWorkers, setUnconfirmedWorkers] = useState([]);
  const { system } = useSystem();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnconfirmedWorkers = async () => {
      try {
        const response = await axios.get(
          `{process.env.BE_HOST}/user/${system}/unconfirmed-workers`,
          {
            headers: { Authorization: authHeader() },
          }
        );
        setUnconfirmedWorkers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnconfirmedWorkers();
  }, [system]);

  const confirmWorker = async (workerEmail) => {
    try {
      await axios.post(
        `{process.env.BE_HOST}/user/${system}/confirm-worker/${workerEmail}`,
        {},
        {
          headers: { Authorization: authHeader() },
        }
      );
      setUnconfirmedWorkers(
        unconfirmedWorkers.filter((worker) => worker.email !== workerEmail)
      );
      navigate(`/${system}/admin-menu`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <ListGroup>
        <h2>Unconfirmed workers list</h2>
        {unconfirmedWorkers.map((worker) => (
          <ListGroup.Item key={worker.email}>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">
                {worker.firstName} {worker.lastName} ({worker.email})
              </p>
              <Button
                variant="success"
                onClick={() => confirmWorker(worker.email)}
              >
                Confirm
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};
export default UnconfirmedWorkers;

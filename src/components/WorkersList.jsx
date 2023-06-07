import React, { useState, useEffect } from "react";
import { ListGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchWorkersFromServer } from "../functions/WorkerFunc";
import { useSystem } from "../App";

const WorkersList = () => {
  const { system } = useSystem();
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      const workersFromServer = await fetchWorkersFromServer(
        system &&
          (typeof system === "string" ? system : system.system) &&
          system
      );
      setWorkers(workersFromServer);
    };

    fetchWorkers(system);
  }, []);

  return (
    <Container>
      <h1 className="mt-3">Workers List</h1>
      <ListGroup>
        {workers &&
          workers.map((worker) => (
            <Link
              as={Link}
              to={`/${system}/calendar/${worker.email}`}
              key={worker.email}
            >
              <ListGroup.Item>
                {`${worker.firstName} ${worker.lastName}`} -{" "}
                {worker.phoneNumber}
              </ListGroup.Item>
            </Link>
          ))}
      </ListGroup>
    </Container>
  );
};

export default WorkersList;

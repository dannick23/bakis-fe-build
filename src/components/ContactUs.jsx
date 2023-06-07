import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSystem } from "../App";
import { fetchContactUs } from "../functions/BackedClient";
import { format, parseISO } from "date-fns";
import { Table } from "react-bootstrap";

const ContactUs = () => {
  const { system } = useSystem();
  const [contactData, setContactData] = useState({
    admins: [],
    workingHours: [],
    address: "",
  });

  useEffect(() => {
    const fetchContactUsText = async () => {
      const fetchedContactUs = await fetchContactUs(system);
      setContactData(
        fetchedContactUs || { admins: [], workingHours: [], address: "" }
      );
    };
    fetchContactUsText();
  }, [system]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1>Contact Us</h1>
          <p>Address: {contactData.address}</p>
          {contactData.admins.map((admin, index) => (
            <Card className="mb-3" key={index}>
              <Card.Header>
                {admin.firstName} {admin.lastName}
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Email: {admin.email}</ListGroup.Item>
                <ListGroup.Item>Phone: {admin.phoneNumber}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {admin.description}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          ))}
          <h2>Working Hours</h2>
          <Table bordered>
            <thead>
              <tr>
                <th>Day of the Week</th>
                <th>Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(7).keys()].map((day) => {
                const hours =
                  contactData.workingHours &&
                  contactData.workingHours.find(
                    (item) => item.dayOfWeek === day
                  );
                return (
                  <tr key={day}>
                    <td>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                    </td>
                    <td>
                      {hours
                        ? `${format(
                            parseISO(hours.timeFrom),
                            "hh:mm a"
                          )} - ${format(parseISO(hours.timeTo), "hh:mm a")}`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;

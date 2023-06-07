import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { useSystem } from "../App";

const NavigationBar = () => {
  const { system, user } = useSystem();

  const userAuthority = user ? user.authority : "CLIENT";

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to={`/${system}/home`}>
        {system.charAt(0).toUpperCase() + system.slice(1).replaceAll("-", " ")}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to={`/${system}/home`}>
            Home
          </Nav.Link>
          {userAuthority !== "ADMIN" && (
            <Nav.Link
              as={Link}
              to={
                userAuthority === "WORKER"
                  ? `/${
                      system && typeof system === "string"
                        ? system
                        : system.system
                    }/agenda/${user.email}`
                  : `/${
                      system && typeof system === "string"
                        ? system
                        : system.system
                    }/register-visit`
              }
            >
              {userAuthority === "WORKER"
                ? "My registrees"
                : "Register for visit"}
            </Nav.Link>
          )}
          <Nav.Link as={Link} to={`/${system}/about-us`}>
            About
          </Nav.Link>
          <Nav.Link as={Link} to={`/${system}/contact-us`}>
            Contact us
          </Nav.Link>
          {userAuthority === "ADMIN" && (
            <Nav.Link as={Link} to={`/${system}/admin-menu`}>
              Admin menu
            </Nav.Link>
          )}
          {user ? (
            <Nav.Link as={Link} to={`/${system}/logout`}>
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to={`/${system}/login`}>
              Login
            </Nav.Link>
          )}
          {!user && (
            <Nav.Link as={Link} to={`/${system}/register`}>
              Register
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default NavigationBar;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Navbar, Nav } from "react-bootstrap";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar-with-bg">
        <Navbar.Brand as={Link} to="/">
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="mr-auto">
            {user == null && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
            {user != null && (
              <>
                <Nav.Link as={Link} to="/user">
                  User
                </Nav.Link>
                <Nav.Link as={Link} to="/cart">
                  Cart
                </Nav.Link>
                {user.roles.includes("ROLE_ADMIN") && (
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
                )}
                <Nav.Link onClick={logout}>Cerrar sesión</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;

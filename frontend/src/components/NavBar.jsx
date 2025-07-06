import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {
  FaHome,
  FaLeaf,
  FaUsers,
  FaInfoCircle,
  FaEnvelope,
  FaFolder,
  FaSignInAlt,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "./NavBar.css";

function NavBar() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const isUser = currentUser?.role === "USER";

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/" className="brand">
          <FaLeaf className="brand-icon" />
          <span>Orchid Paradise</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!isAdmin && (
              <>
                <Nav.Link href="/" className="nav-item">
                  <FaHome className="nav-icon" />
                  Home
                </Nav.Link>
              </>
            )}
            {isAdmin && (
              <>
                <Nav.Link href="/orchids" className="nav-item">
                  <FaLeaf className="nav-icon" />
                  Orchids
                </Nav.Link>
                <Nav.Link href="/categories" className="nav-item">
                  <FaFolder className="nav-icon" />
                  Categories
                </Nav.Link>
                <Nav.Link href="/employees" className="nav-item">
                  <FaUsers className="nav-icon" />
                  Our Team
                </Nav.Link>
              </>
            )}
            {!isAdmin && (
              <>
                <Nav.Link href="/about" className="nav-item">
                  <FaInfoCircle className="nav-icon" />
                  About
                </Nav.Link>
                <Nav.Link href="/contact" className="nav-item">
                  <FaEnvelope className="nav-icon" />
                  Contact
                </Nav.Link>
              </>
            )}

            {isUser && isAuthenticated && (
              <Nav.Link href="/orders" className="nav-item">
                <FaShoppingCart className="nav-icon" />
                Cart
              </Nav.Link>
            )}

            {isAuthenticated ? (
              <NavDropdown
                title={
                  <span>
                    <FaUsers className="nav-icon" />
                    {currentUser?.fullName || "User"}
                  </span>
                }
                id="user-nav-dropdown"
                className="nav-item"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login" className="nav-item">
                <FaSignInAlt className="nav-icon" />
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

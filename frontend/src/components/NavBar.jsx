import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaHome, FaLeaf, FaUsers, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import './NavBar.css';

function NavBar() {
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
            <Nav.Link href="/" className="nav-item">
              <FaHome className="nav-icon" />
              Home
            </Nav.Link>
            <Nav.Link href="/orchids" className="nav-item">
              <FaLeaf className="nav-icon" />
              Orchids
            </Nav.Link>
            <Nav.Link href="/employees" className="nav-item">
              <FaUsers className="nav-icon" />
              Our Team
            </Nav.Link>
            <Nav.Link href="/about" className="nav-item">
              <FaInfoCircle className="nav-icon" />
              About
            </Nav.Link>
            <Nav.Link href="/contact" className="nav-item">
              <FaEnvelope className="nav-icon" />
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaHome, FaLeaf, FaUsers, FaInfoCircle, FaEnvelope, FaFolder, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AccountService } from '../services';
import './NavBar.css';

function NavBar() {
  const isAuthenticated = AccountService.isAuthenticated();
  const currentUser = AccountService.getCurrentUser();

  const handleLogout = () => {
    AccountService.logout();
    window.location.href = '/';
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
            <Nav.Link href="/" className="nav-item">
              <FaHome className="nav-icon" />
              Home
            </Nav.Link>
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
            <Nav.Link href="/about" className="nav-item">
              <FaInfoCircle className="nav-icon" />
              About
            </Nav.Link>
            <Nav.Link href="/contact" className="nav-item">
              <FaEnvelope className="nav-icon" />
              Contact
            </Nav.Link>
            
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <FaUsers className="nav-icon" />
                    {currentUser?.fullName || 'User'}
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
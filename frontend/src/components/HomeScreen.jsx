import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { Button, Col, Image, Modal, Row, Card, Spinner, Alert, Form, InputGroup, Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router";
import { OrchidService, OrderService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import "./HomeScreen.css";

export default function HomeScreen() {
  const [api, setAPI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Cart related states
  const [quantities, setQuantities] = useState({});
  const [addingToOrder, setAddingToOrder] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  
  // Auth context
  const { isAuthenticated, isUser, currentUser } = useAuth();

  // Mock data for fallback when API fails
  const mockOrchids = [
    {
      orchidId: 1,
      orchidName: "Phalaenopsis Pink",
      orchidUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
      orchidDescription: "A beautiful pink orchid with delicate petals",
      price: 25.99,
      isNatural: true,
      categoryId: 1
    },
    {
      orchidId: 2,
      orchidName: "Cattleya Purple",
      orchidUrl: "https://images.unsplash.com/photo-1591958911259-bee2173bdcbc?w=500&h=600&fit=crop",
      orchidDescription: "A stunning purple cattleya orchid",
      price: 45.50,
      isNatural: false,
      categoryId: 2
    },
    {
      orchidId: 3,
      orchidName: "Dendrobium White",
      orchidUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=600&fit=crop",
      orchidDescription: "Elegant white dendrobium orchid",
      price: 35.75,
      isNatural: true,
      categoryId: 1
    },
    {
      orchidId: 4,
      orchidName: "Vanda Blue",
      orchidUrl: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=600&fit=crop",
      orchidDescription: "Rare blue vanda orchid",
      price: 65.00,
      isNatural: false,
      categoryId: 3
    },
    {
      orchidId: 5,
      orchidName: "Oncidium Yellow",
      orchidUrl: "https://images.unsplash.com/photo-1615560421830-fb649bee8c49?w=500&h=600&fit=crop",
      orchidDescription: "Bright yellow oncidium orchid",
      price: 28.50,
      isNatural: true,
      categoryId: 2
    },
    {
      orchidId: 6,
      orchidName: "Cymbidium Green",
      orchidUrl: "https://images.unsplash.com/photo-1583468723894-ad3b84ff207b?w=500&h=600&fit=crop",
      orchidDescription: "Beautiful green cymbidium orchid",
      price: 42.25,
      isNatural: false,
      categoryId: 1
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      
      // Fetch from real API
      const orchids = await OrchidService.getAllOrchids();
      console.log('Fetched orchids:', orchids.data);
      
      // Sort by orchidId in descending order (newest first)
      const sortedData = orchids.sort((a, b) => b.orchidId - a.orchidId);
      setAPI(sortedData);
      
    } catch (error) {
      console.error("Error fetching orchids:", error);
      
      // Use mock data when API fails
      setError("Could not connect to server. Showing sample data instead.");
      setUsingMockData(true);
      setAPI(mockOrchids);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchData();
  };

  // Handle quantity change for specific orchid
  const handleQuantityChange = (orchidId, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantities(prev => ({
      ...prev,
      [orchidId]: quantity
    }));
  };

  // Add to order function
  const handleAddToOrder = async (orchid) => {
    if (!isAuthenticated) {
      showToastMessage('Please login to add items to cart', 'warning');
      return;
    }

    if (!isUser) {
      showToastMessage('Only users can add items to cart', 'warning');
      return;
    }

    const quantity = quantities[orchid.orchidId] || 1;
    setAddingToOrder(prev => ({ ...prev, [orchid.orchidId]: true }));

    try {
      await OrderService.addToOrder(orchid.orchidId, quantity);
      showToastMessage(`Added ${quantity} ${orchid.orchidName}(s) to cart!`, 'success');
      // Reset quantity to 1 after successful add
      setQuantities(prev => ({
        ...prev,
        [orchid.orchidId]: 1
      }));
    } catch (error) {
      console.error('Error adding to order:', error);
      showToastMessage(error.message || 'Failed to add item to cart', 'danger');
    } finally {
      setAddingToOrder(prev => ({ ...prev, [orchid.orchidId]: false }));
    }
  };

  // Show toast message
  const showToastMessage = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  if (loading) {
    return (
      <div className="homescreen-bg d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="light" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="text-white mt-3">Loading orchid collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homescreen-bg">
      <Container className="py-5">
        {/* Connection Error Alert */}
        {error && (
          <Alert variant="warning" className="mb-4 rounded-4 custom-alert">
            <Alert.Heading>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Connection Issue
            </Alert.Heading>
            <p>{error}</p>
            <Button variant="primary" onClick={retryFetch} size="sm" className="rounded-pill">
              <i className="bi bi-arrow-clockwise me-2"></i>
              Retry Connection
            </Button>
          </Alert>
        )}

        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold mb-3 orchid-title">
            <span role="img" aria-label="orchid">🌸</span> Orchid Collection
            {usingMockData && (
              <span className="badge bg-warning text-dark ms-3">DEMO MODE</span>
            )}
          </h1>
          <p className="lead text-white-50 mb-4 orchid-subtitle">
            Discover our beautiful collection of rare and exotic orchids
          </p>
          {/* Authentication Status */}
          {isAuthenticated && currentUser && (
            <div className="mb-4">
              <Alert variant="info" className="d-inline-block rounded-pill px-4 py-2 mb-0 custom-user-alert">
                <i className={`bi ${isUser ? 'bi-person-check' : 'bi-person-gear'} me-2`}></i>
                Welcome back, <strong>{currentUser.accountName || currentUser.userName}</strong>
                <span className={`badge ms-2 ${isUser ? 'bg-success' : 'bg-primary'}`}>{currentUser.role}</span>
                {isUser && (
                  <small className="ms-2 text-muted">
                    <i className="bi bi-cart me-1"></i>
                    You can add orchids to cart
                  </small>
                )}
              </Alert>
            </div>
          )}
          {/* Stats Card */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Card className="bg-white shadow-lg border-0 rounded-4 stats-card">
                <Card.Body className="text-center py-3">
                  <Row>
                    <Col md={4} className="stats-item">
                      <div className="stats-icon bg-primary text-white mb-2"><i className="bi bi-flower1"></i></div>
                      <h3 className="text-primary mb-0">{api.length}</h3>
                      <small className="text-muted">Total Orchids</small>
                    </Col>
                    <Col md={4} className="stats-item">
                      <div className="stats-icon bg-success text-white mb-2"><i className="bi bi-droplet-half"></i></div>
                      <h3 className="text-success mb-0">{api.filter(o => o.isNatural).length}</h3>
                      <small className="text-muted">Natural</small>
                    </Col>
                    <Col md={4} className="stats-item">
                      <div className="stats-icon bg-warning text-white mb-2"><i className="bi bi-gear"></i></div>
                      <h3 className="text-warning mb-0">{api.filter(o => !o.isNatural).length}</h3>
                      <small className="text-muted">Hybrid</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>

        {/* Orchids Grid */}
        {api.length === 0 && !loading ? (
          <div className="text-center py-5">
            <div className="bg-white rounded-4 shadow-lg p-5 mx-auto empty-orchid-card">
              <i className="bi bi-flower1 display-1 text-muted mb-3"></i>
              <h4 className="text-muted mb-3">No orchids found</h4>
              <p className="text-muted mb-4">Please check back later or try refreshing the page.</p>
              <Button variant="primary" onClick={retryFetch} className="rounded-pill px-4">
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {api.map((orchid) => (
              <Col key={orchid.orchidId}>
                <Card 
                  className="orchid-card h-100 border-0 shadow-lg rounded-4 overflow-hidden"
                >
                  <div className="position-relative orchid-img-wrapper">
                    <Card.Img
                      variant="top"
                      src={orchid.orchidUrl || orchid.image}
                      alt={orchid.orchidName}
                      className="orchid-img"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(orchid.orchidName)}&background=random&size=400`;
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className="orchid-img-gradient"></div>
                    {/* Mock Data Badge */}
                    {usingMockData && (
                      <div className={`position-absolute ${isAuthenticated ? 'top-0 start-0 mt-5 ms-3' : 'top-0 start-0 m-3'}`}>
                        <span className="badge bg-warning text-dark">DEMO</span>
                      </div>
                    )}
                    {/* Price Badge */}
                    {orchid.price && (
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <span className="badge bg-dark text-white px-3 py-2 rounded-pill orchid-price-badge">
                          <i className="bi bi-currency-dollar"></i>
                          {parseFloat(orchid.price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Card.Body className="p-4 d-flex flex-column">
                    <Card.Title className="mb-3 text-dark fw-bold orchid-card-title">
                      {orchid.orchidName}
                    </Card.Title>
                    {orchid.orchidDescription && (
                      <Card.Text className="text-muted mb-4 flex-grow-1 orchid-card-desc">
                        {orchid.orchidDescription.length > 100 
                          ? `${orchid.orchidDescription.substring(0, 100)}...`
                          : orchid.orchidDescription
                        }
                      </Card.Text>
                    )}
                    <div className="mt-auto">
                      {/* Add to Cart Section - Only for authenticated USERs */}
                      {isAuthenticated && isUser && (
                        <div className="cart-section">
                          <Row className="g-2 align-items-center">
                            <Col xs={4}>
                              <Form.Control
                                type="number"
                                min="1"
                                max="99"
                                value={quantities[orchid.orchidId] || 1}
                                onChange={(e) => handleQuantityChange(orchid.orchidId, e.target.value)}
                                className="quantity-input orchid-qty-input"
                                size="sm"
                              />
                            </Col>
                            <Col xs={8}>
                              <Button
                                className="add-to-cart-btn w-100 rounded-pill orchid-cart-btn"
                                size="sm"
                                onClick={() => handleAddToOrder(orchid)}
                                disabled={addingToOrder[orchid.orchidId]}
                              >
                                {addingToOrder[orchid.orchidId] ? (
                                  <>
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                      className="me-1"
                                    />
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-cart-plus me-1"></i>
                                    Add to Cart
                                  </>
                                )}
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      )}
                      {/* View Details Button */}
                      <Link 
                        to={`/detail/${orchid.orchidId}`} 
                        className="btn btn-outline-primary w-100 rounded-pill orchid-detail-btn"
                        style={{ textDecoration: 'none' }}
                      >
                        <i className="bi bi-eye me-2"></i>
                        View Details
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        {/* Navigation to Management */}
        <div className="text-center mt-5 pt-4">
          <Link to="/orchids" className="btn btn-light btn-lg rounded-pill px-5 shadow orchid-manage-btn">
            <i className="bi bi-gear me-2"></i>
            Manage Orchids
          </Link>
        </div>
      </Container>
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg={toastVariant}
          className="custom-toast"
        >
          <Toast.Header>
            <i className={`bi ${
              toastVariant === 'success' ? 'bi-check-circle' : 
              toastVariant === 'warning' ? 'bi-exclamation-triangle' : 
              'bi-x-circle'
            } me-2`}></i>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 
               toastVariant === 'warning' ? 'Warning' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

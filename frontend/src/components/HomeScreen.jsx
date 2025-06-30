import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { Button, Col, Image, Modal, Row, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router";
import { OrchidService } from "../services";
import "./HomeScreen.css";

export default function HomeScreen() {
  const [api, setAPI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

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
      console.log('Fetched orchids:', orchids);
      
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

  if (loading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        {/* Connection Error Alert */}
        {error && (
          <Alert variant="warning" className="mb-4 rounded-4">
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
          <h1 className="display-4 text-white fw-bold mb-3">
            🌺 Orchid Collection
            {usingMockData && (
              <span className="badge bg-warning text-dark ms-3">DEMO MODE</span>
            )}
          </h1>
          <p className="lead text-white-50 mb-4">
            Discover our beautiful collection of rare and exotic orchids
          </p>
          
          {/* Stats Card */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Card className="bg-white shadow-lg border-0 rounded-4">
                <Card.Body className="text-center py-3">
                  <Row>
                    <Col md={4}>
                      <h3 className="text-primary mb-0">{api.length}</h3>
                      <small className="text-muted">Total Orchids</small>
                    </Col>
                    <Col md={4}>
                      <h3 className="text-success mb-0">
                        {api.filter(o => o.isNatural).length}
                      </h3>
                      <small className="text-muted">Natural</small>
                    </Col>
                    <Col md={4}>
                      <h3 className="text-warning mb-0">
                        {api.filter(o => !o.isNatural).length}
                      </h3>
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
            <div className="bg-white rounded-4 shadow-lg p-5 mx-auto" style={{ maxWidth: '500px' }}>
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
                  className="h-100 border-0 shadow-lg rounded-4 overflow-hidden"
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={orchid.orchidUrl || orchid.image}
                      alt={orchid.orchidName}
                      style={{ 
                        height: '250px', 
                        objectFit: 'cover',
                        filter: 'brightness(0.9)'
                      }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(orchid.orchidName)}&background=random&size=400`;
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)'
                      }}
                    ></div>
                    
                    {/* Natural/Hybrid Badge */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className={`badge px-3 py-2 rounded-pill ${
                        orchid.isNatural ? 'bg-success' : 'bg-info'
                      }`} style={{ fontSize: '0.8rem' }}>
                        <i className={`bi ${orchid.isNatural ? 'bi-flower1' : 'bi-gear'} me-1`}></i>
                        {orchid.isNatural ? 'Natural' : 'Hybrid'}
                      </span>
                    </div>
                    
                    {/* Mock Data Badge */}
                    {usingMockData && (
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-warning text-dark">DEMO</span>
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    {orchid.price && (
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <span className="badge bg-dark text-white px-3 py-2 rounded-pill">
                          <i className="bi bi-currency-dollar"></i>
                          {parseFloat(orchid.price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Card.Body className="p-4 d-flex flex-column">
                    <Card.Title className="mb-3 text-dark fw-bold">
                      {orchid.orchidName}
                    </Card.Title>
                    
                    {orchid.orchidDescription && (
                      <Card.Text className="text-muted mb-4 flex-grow-1">
                        {orchid.orchidDescription.length > 100 
                          ? `${orchid.orchidDescription.substring(0, 100)}...`
                          : orchid.orchidDescription
                        }
                      </Card.Text>
                    )}
                    
                    <div className="mt-auto">
                      <Link 
                        to={`/detail/${orchid.orchidId}`} 
                        className="btn btn-outline-primary w-100 rounded-pill"
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
          <Link to="/orchids" className="btn btn-light btn-lg rounded-pill px-5 shadow">
            <i className="bi bi-gear me-2"></i>
            Manage Orchids
          </Link>
        </div>
      </Container>
    </div>
  );
}

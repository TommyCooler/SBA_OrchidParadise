import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { Button, Col, Image, Modal, Row, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router";
import "./HomeScreen.css";

export default function HomeScreen() {
  const baseUrl = import.meta.env.VITE_API_URL;
  // const baseUrl = ""; // Thay thế bằng URL API thực tế
  const [api, setAPI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFakeData, setUsingFakeData] = useState(false);

  // Dữ liệu giả
  const fakeOrchids = [
    {
      id: 1,
      orchidName: "Phalaenopsis Pink",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
      description: "A beautiful pink orchid with delicate petals",
      isNatural: true,
      empId: "001"
    },
    {
      id: 2,
      orchidName: "Cattleya Purple",
      image: "https://images.unsplash.com/photo-1591958911259-bee2173bdcbc?w=500&h=600&fit=crop",
      description: "A stunning purple cattleya orchid",
      isNatural: false,
      empId: "002"
    },
    {
      id: 3,
      orchidName: "Dendrobium White",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=600&fit=crop",
      description: "Elegant white dendrobium orchid",
      isNatural: true,
      empId: "003"
    },
    {
      id: 4,
      orchidName: "Vanda Blue",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=600&fit=crop",
      description: "Rare blue vanda orchid",
      isNatural: false,
      empId: "004"
    },
    {
      id: 5,
      orchidName: "Oncidium Yellow",
      image: "https://images.unsplash.com/photo-1615560421830-fb649bee8c49?w=500&h=600&fit=crop",
      description: "Bright yellow oncidium orchid",
      isNatural: true,
      empId: "005"
    },
    {
      id: 6,
      orchidName: "Cymbidium Green",
      image: "https://images.unsplash.com/photo-1583468723894-ad3b84ff207b?w=500&h=600&fit=crop",
      description: "Beautiful green cymbidium orchid",
      isNatural: false,
      empId: "006"
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFakeData(false);
      
      const response = await axios.get(baseUrl);
      const sortedData = response.data.sort(
        (a, b) => parseInt(b.empId) - parseInt(a.empId)
      );
      setAPI(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      
      // Sử dụng dữ liệu giả khi fetch thất bại
      setError("Could not connect to server. Showing sample data instead.");
      setUsingFakeData(true);
      setAPI(fakeOrchids);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="home-container mt-5">
      {/* Hiển thị thông báo khi sử dụng dữ liệu giả */}
      {error && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>
            <i className="fas fa-exclamation-triangle me-2"></i>
            Connection Issue
          </Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={retryFetch} size="sm">
            <i className="fas fa-redo me-2"></i>
            Retry Connection
          </Button>
        </Alert>
      )}

      <div className="header-section text-center mb-5">
        <h1 className="display-4">
          Orchid Collection
          {usingFakeData && (
            <span className="badge bg-warning text-dark ms-2">Demo Mode</span>
          )}
        </h1>
        <p className="lead text-muted">
          Discover our beautiful collection of rare and exotic orchids
        </p>
      </div>

      <Row className="g-4">
        {api.map((item) => (
          <Col md={4} key={item.id}>
            <Card className="h-100 orchid-card">
              <div className="card-img-wrapper">
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt={item.orchidName}
                  className="card-img"
                  onError={(e) => {
                    // Fallback image nếu image không load được
                    e.target.src = "https://via.placeholder.com/500x600/f8f9fa/6c757d?text=Orchid+Image";
                  }}
                />
                {item.isNatural !== undefined && (
                  <div className="card-badge">
                    <span className={`badge ${item.isNatural ? 'bg-success' : 'bg-info'}`}>
                      {item.isNatural ? 'Natural' : 'Hybrid'}
                    </span>
                  </div>
                )}
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">{item.orchidName}</Card.Title>
                {item.description && (
                  <Card.Text className="text-muted mb-4">
                    {item.description}
                  </Card.Text>
                )}
                <div className="mt-auto text-end">
                  <Link to={`/detail/${item.id}`} className="detail-link">
                    View Details
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {api.length === 0 && !loading && (
        <div className="text-center py-5">
          <i className="fas fa-seedling fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No orchids found</h4>
          <p className="text-muted">Please check back later or try refreshing the page.</p>
          <Button variant="primary" onClick={retryFetch}>
            <i className="fas fa-redo me-2"></i>
            Refresh
          </Button>
        </div>
      )}
    </Container>
  );
}

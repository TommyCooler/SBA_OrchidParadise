import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Form, FormGroup, Image, Modal, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { Link } from 'react-router';

// Mock data for testing when API fails
const mockOrchids = [
  {
    id: "1",
    orchidName: "Phalaenopsis Orchid",
    image: "https://images.unsplash.com/photo-1566550747935-21b4605d282d?w=500",
    isNatural: true
  },
  {
    id: "2", 
    orchidName: "Cattleya Orchid",
    image: "https://images.unsplash.com/photo-1567014749344-506469721e67?w=500",
    isNatural: false
  },
  {
    id: "3",
    orchidName: "Dendrobium Orchid", 
    image: "https://images.unsplash.com/photo-1610397648930-477b8c7f0943?w=500",
    isNatural: true
  },
  {
    id: "4",
    orchidName: "Vanda Orchid",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500", 
    isNatural: false
  },
  {
    id: "5",
    orchidName: "Oncidium Orchid",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500",
    isNatural: true
  },
  {
    id: "6",
    orchidName: "Cymbidium Orchid",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    isNatural: false
  },
  {
    id: "7",
    orchidName: "Paphiopedilum Orchid",
    image: "https://images.unsplash.com/photo-1591958911259-bee2173bdcbc?w=500",
    isNatural: true
  },
  {
    id: "8",
    orchidName: "Miltonia Orchid",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
    isNatural: false
  }
];

export default function ListOfOrchids() {
    const baseUrl = import.meta.env.VITE_API_URL;
    const [api, setAPI] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usingMockData, setUsingMockData] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm();
    const watchedImage = watch('image');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(baseUrl); 
          const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          setAPI(sortedData);
          setUsingMockData(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setAPI(mockOrchids);
          setUsingMockData(true);
          toast.error("Using mock data due to API error");
        } finally {
          setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
          if (!usingMockData) {
            const response = await axios.delete(`${baseUrl}/${id}`);
            fetchData();
            toast.success("Orchid deleted successfully!");
          } else {
            // Mock delete for mock data
            setAPI(prev => prev.filter(orchid => orchid.id !== id));
            toast.success("Mock orchid deleted!");
          }
        } catch (error) {
          console.log(error.message);
          toast.error("Orchid deletion failed!");
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
          if (!usingMockData) {
            const response = await axios.post(baseUrl, data, { 
              headers: { 'Content-Type': 'application/json' }
            });
            fetchData();
            toast.success("Orchid added successfully!");
          } else {
            // Mock add for mock data
            await new Promise(resolve => setTimeout(resolve, 1000));
            const newOrchid = {
              ...data,
              id: String(Math.max(...api.map(o => parseInt(o.id)), 0) + 1)
            };
            setAPI(prev => [newOrchid, ...prev]);
            toast.success("Mock orchid added successfully!");
          }
          
          setShow(false);
          reset();
        } catch (error) {
          console.log(error.message);
          toast.error("Orchid addition failed!");
        } finally {
          setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="light" size="lg" />
                    <p className="text-white mt-3">Loading orchids...</p>
                </Container>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            <Container className="py-5">
                <Toaster position="top-right" />
                
                {/* Mock Data Warning */}
                {usingMockData && (
                    <Alert variant="warning" className="mb-4 rounded-4">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Test Mode:</strong> You are viewing mock orchid data. API is unavailable.
                    </Alert>
                )}
                
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h1 className="display-4 text-white fw-bold mb-3">
                        🌺 Orchid Collection
                        {usingMockData && <span className="badge bg-warning text-dark ms-3">MOCK DATA</span>}
                    </h1>
                    <p className="lead text-white-50 mb-4">
                        Discover and manage beautiful orchid varieties
                    </p>
                    <Button 
                        variant="light" 
                        size="lg"
                        onClick={handleShow}
                        className="px-4 py-2 rounded-pill shadow-lg"
                        style={{ 
                            background: usingMockData ? 
                                'linear-gradient(45deg, #ff9800, #f57c00)' : 
                                'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                            border: 'none',
                            color: 'white'
                        }}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        {usingMockData ? 'Add Mock Orchid' : 'Add New Orchid'}
                    </Button>
                </div>

                {/* Stats Card */}
                <Row className="mb-4">
                    <Col>
                        <Card className="bg-white shadow-lg border-0 rounded-4">
                            <Card.Body className="text-center py-3">
                                <Row>
                                    <Col md={4}>
                                        <h3 className="text-primary mb-0">{api.length}</h3>
                                        <small className="text-muted">Total Orchids</small>
                                    </Col>
                                    <Col md={4}>
                                        <h3 className="text-success mb-0">{api.filter(o => o.isNatural).length}</h3>
                                        <small className="text-muted">Natural</small>
                                    </Col>
                                    <Col md={4}>
                                        <h3 className="text-warning mb-0">{api.filter(o => !o.isNatural).length}</h3>
                                        <small className="text-muted">Industry</small>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Orchid Cards Grid */}
                {api.length === 0 ? (
                    <Alert variant="info" className="text-center py-5 rounded-4">
                        <i className="bi bi-flower1 display-1 d-block mb-3"></i>
                        <h4>No orchids found</h4>
                        <p>Start by adding your first orchid to the collection!</p>
                    </Alert>
                ) : (
                    <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                        {api.map((orchid) => (
                            <Col key={orchid.id}>
                                <Card 
                                    className="h-100 border-0 shadow-lg rounded-4 overflow-hidden"
                                    style={{ 
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <div className="position-relative">
                                        <Card.Img 
                                            variant="top" 
                                            src={orchid.image} 
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(orchid.orchidName)}&background=random&size=300`;
                                            }}
                                            style={{ 
                                                height: '250px', 
                                                objectFit: 'cover',
                                                filter: 'brightness(0.9)'
                                            }}
                                        />
                                        <div 
                                            className="position-absolute top-0 start-0 w-100 h-100"
                                            style={{
                                                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)'
                                            }}
                                        ></div>
                                        <Badge 
                                            className={`position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill ${
                                                orchid.isNatural ? 'bg-success' : 'bg-warning'
                                            }`}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            <i className={`bi ${orchid.isNatural ? 'bi-flower1' : 'bi-gear'} me-1`}></i>
                                            {orchid.isNatural ? 'Natural' : 'Industry'}
                                        </Badge>
                                        {usingMockData && (
                                            <Badge className="position-absolute top-0 start-0 m-3 bg-warning text-dark">
                                                MOCK
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <Card.Body className="p-4">
                                        <Card.Title className="mb-3 text-dark fw-bold">
                                            {orchid.orchidName}
                                        </Card.Title>
                                        <Card.Text className="text-muted small mb-3">
                                            <i className="bi bi-calendar3 me-2"></i>
                                            {usingMockData ? 'Mock Data' : 'Added recently'}
                                        </Card.Text>
                                        
                                        <div className="d-flex gap-2">
                                            <Link to={`/edit/${orchid.id}`} className="flex-fill">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    className="w-100 rounded-pill"
                                                >
                                                    <i className="bi bi-pencil-square me-1"></i>
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                className="rounded-pill px-3"
                                                onClick={() => {
                                                    if(confirm(`Are you sure you want to delete ${orchid.orchidName}?`)) {
                                                        handleDelete(orchid.id);
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Enhanced Modal */}
                <Modal 
                    show={show} 
                    onHide={handleClose} 
                    backdrop="static"
                    centered
                    size="lg"
                >
                    <Modal.Header 
                        closeButton 
                        className="border-0 pb-0"
                        style={{ 
                            background: usingMockData ? 
                                'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' :
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                    >
                        <Modal.Title className="text-white fw-bold">
                            <i className="bi bi-flower1 me-2"></i>
                            Add New Orchid
                            {usingMockData && <span className="badge bg-light text-dark ms-2">MOCK</span>}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body className="p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-tag me-2"></i>Orchid Name
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter orchid name..."
                                            className="rounded-pill px-3"
                                            autoFocus
                                            {...register("orchidName", { required: "Name is required" })}
                                        />
                                        {errors.orchidName && (
                                            <div className="text-danger small mt-1">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {errors.orchidName.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-image me-2"></i>Image URL
                                        </Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="https://example.com/orchid-image.jpg"
                                            className="rounded-pill px-3"
                                            {...register("image", { 
                                                required: "Image URL is required",
                                                pattern: {
                                                    value: /(https?:\/\/[^\s]+)/i,
                                                    message: "Please enter a valid URL"
                                                }
                                            })}
                                        />
                                        {errors.image && (
                                            <div className="text-danger small mt-1">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {errors.image.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <div className="d-flex align-items-center">
                                            <Form.Check
                                                type="switch"
                                                id="natural-switch"
                                                className="me-3"
                                                {...register("isNatural")}
                                            />
                                            <Form.Label htmlFor="natural-switch" className="mb-0 fw-semibold">
                                                <i className="bi bi-flower1 me-2 text-success"></i>
                                                Natural Orchid
                                            </Form.Label>
                                        </div>
                                        <small className="text-muted">
                                            Toggle if this is a naturally grown orchid
                                        </small>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <div className="sticky-top" style={{ top: '2rem' }}>
                                        <h6 className="fw-semibold mb-3 text-center">
                                            <i className="bi bi-eye me-2"></i>
                                            Preview
                                        </h6>
                                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                                            <Image 
                                                src={watchedImage || "https://via.placeholder.com/300x200?text=No+Image"} 
                                                className="w-100"
                                                style={{ 
                                                    height: '200px', 
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/300x200?text=Invalid+URL";
                                                }}
                                            />
                                        </Card>
                                    </div>
                                </Col>
                            </Row>

                            <Modal.Footer className="border-0 pt-4">
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleClose}
                                    className="rounded-pill px-4"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="primary" 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-pill px-4"
                                    style={{ 
                                        background: usingMockData ? 
                                            'linear-gradient(45deg, #ff9800, #f57c00)' : 
                                            'linear-gradient(45deg, #667eea, #764ba2)',
                                        border: 'none'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            {usingMockData ? 'Simulating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            {usingMockData ? 'Add Mock' : 'Add Orchid'}
                                        </>
                                    )}
                                </Button>
                            </Modal.Footer>
                        </form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

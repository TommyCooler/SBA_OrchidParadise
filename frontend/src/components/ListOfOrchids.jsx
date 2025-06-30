import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Form, FormGroup, Image, Modal, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { Link } from 'react-router';
import { OrchidService, CategoryService } from '../services';

// Mock data for testing when API fails
const mockOrchids = [
//   {
//     id: "1",
//     orchidName: "Phalaenopsis Orchid",
//     image: "https://images.unsplash.com/photo-1566550747935-21b4605d282d?w=500",
//     isNatural: true
//   },
//   {
//     id: "2", 
//     orchidName: "Cattleya Orchid",
//     image: "https://images.unsplash.com/photo-1567014749344-506469721e67?w=500",
//     isNatural: false
//   },
//   {
//     id: "3",
//     orchidName: "Dendrobium Orchid", 
//     image: "https://images.unsplash.com/photo-1610397648930-477b8c7f0943?w=500",
//     isNatural: true
//   },
//   {
//     id: "4",
//     orchidName: "Vanda Orchid",
//     image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500", 
//     isNatural: false
//   },
//   {
//     id: "5",
//     orchidName: "Oncidium Orchid",
//     image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500",
//     isNatural: true
//   },
//   {
//     id: "6",
//     orchidName: "Cymbidium Orchid",
//     image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
//     isNatural: false
//   },
//   {
//     id: "7",
//     orchidName: "Paphiopedilum Orchid",
//     image: "https://images.unsplash.com/photo-1591958911259-bee2173bdcbc?w=500",
//     isNatural: true
//   },
//   {
//     id: "8",
//     orchidName: "Miltonia Orchid",
//     image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
//     isNatural: false
//   }
];

export default function ListOfOrchids() {
    const [api, setAPI] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usingMockData, setUsingMockData] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = async () => {
        setShow(true);
        await fetchCategories();
    };
    
    const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm();
    const watchedImage = watch('orchidUrl');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const categoryData = await CategoryService.getAllCategories();
            setCategories(categoryData);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
          const data = await OrchidService.getAllOrchids();
          const sortedData = data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          setAPI(sortedData);
          setUsingMockData(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setAPI(mockOrchids);
        //   setUsingMockData(true);
          toast.error("Using mock data due to API error");
        } finally {
          setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
          if (!usingMockData) {
            await OrchidService.deleteOrchid(id);
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
            // Convert form data to match OrchidRequest DTO structure
            const orchidRequest = {
                orchidName: data.orchidName.trim(),
                orchidDescription: data.orchidDescription.trim(),
                orchidUrl: data.orchidUrl.trim(),
                price: parseFloat(data.price),
                isNatural: Boolean(data.isNatural), // Ensure it's a boolean, not undefined
                categoryId: parseInt(data.categoryId) // Convert to Long (which is number in JS)
            };

            console.log('Creating orchid with request:', orchidRequest);

            if (!usingMockData) {
                await OrchidService.createOrchid(orchidRequest);
                fetchData();
                toast.success("Orchid added successfully!");
            } else {
                // Mock add for mock data
                await new Promise(resolve => setTimeout(resolve, 1000));
                const newOrchid = {
                    ...orchidRequest,
                    id: String(Math.max(...api.map(o => parseInt(o.id)), 0) + 1),
                    image: orchidRequest.orchidUrl // Map orchidUrl to image for mock data display
                };
                setAPI(prev => [newOrchid, ...prev]);
                toast.success("Mock orchid added successfully!");
            }
            
            setShow(false);
            reset();
        } catch (error) {
            console.error('Error creating orchid:', error);
            toast.error(error.message || "Orchid addition failed!");
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
                                            src={orchid.orchidUrl} 
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
                                            <Link to={`/edit/${orchid.orchidId}`} className="flex-fill">
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
                                                        handleDelete(orchid.orchidId);
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
                    size="xl"
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
                                    {/* Orchid Name */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-tag me-2"></i>Orchid Name *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter orchid name..."
                                            className="rounded-pill px-3"
                                            autoFocus
                                            {...register("orchidName", { 
                                                required: "Orchid name is required",
                                                maxLength: {
                                                    value: 100,
                                                    message: "Name must be less than 100 characters"
                                                },
                                                minLength: {
                                                    value: 2,
                                                    message: "Name must be at least 2 characters"
                                                }
                                            })}
                                        />
                                        {errors.orchidName && (
                                            <div className="text-danger small mt-1">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {errors.orchidName.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Orchid Description */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-file-text me-2"></i>Description *
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter orchid description..."
                                            className="rounded-3 px-3"
                                            {...register("orchidDescription", {
                                                required: "Description is required",
                                                maxLength: {
                                                    value: 500,
                                                    message: "Description must be less than 500 characters"
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: "Description must be at least 10 characters"
                                                }
                                            })}
                                        />
                                        {errors.orchidDescription && (
                                            <div className="text-danger small mt-1">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {errors.orchidDescription.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Image URL */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-image me-2"></i>Image URL *
                                        </Form.Label>
                                        <Form.Control 
                                            type="url" 
                                            placeholder="https://example.com/orchid-image.jpg"
                                            className="rounded-pill px-3"
                                            {...register("orchidUrl", { 
                                                required: "Image URL is required",
                                                maxLength: {
                                                    value: 255,
                                                    message: "URL must be less than 255 characters"
                                                },
                                                pattern: {
                                                    value: /^https?:\/\/.+\..+/i,
                                                    message: "Please enter a valid URL starting with http:// or https://"
                                                }
                                            })}
                                        />
                                        {errors.orchidUrl && (
                                            <div className="text-danger small mt-1">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {errors.orchidUrl.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Price */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-currency-dollar me-2"></i>Price *
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="0.00"
                                            className="rounded-pill px-3"
                                            {...register("price", {
                                                required: "Price is required",
                                                min: {
                                                    value: 0.01,
                                                    message: "Price must be greater than 0"
                                                },
                                                max: {
                                                    value: 999999.99,
                                                    message: "Price is too high"
                                                }
                                            })}
                                        />
                                        {errors.price && (
                                            <div className="text-danger small mt-1">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {errors.price.message}
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Category Selection */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <i className="bi bi-folder me-2"></i>Category *
                                        </Form.Label>
                                        <Form.Select
                                            className="rounded-pill px-3"
                                            {...register("categoryId", {
                                                required: "Category is required",
                                                validate: value => {
                                                    if (!value || value === "") {
                                                        return "Please select a category";
                                                    }
                                                    return true;
                                                }
                                            })}
                                            disabled={loadingCategories}
                                        >
                                            <option value="">
                                                {loadingCategories ? "Loading categories..." : "Select a category"}
                                            </option>
                                            {categories.map((category) => (
                                                <option key={category.categoryId} value={category.categoryId}>
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.categoryId && (
                                            <div className="text-danger small mt-1">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {errors.categoryId.message}
                                            </div>
                                        )}
                                        {categories.length === 0 && !loadingCategories && (
                                            <div className="text-warning small mt-1">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                No categories available. Please create a category first.
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Natural Switch - with default value */}
                                    <Form.Group className="mb-4">
                                        <div className="d-flex align-items-center">
                                            <Form.Check
                                                type="switch"
                                                id="natural-switch"
                                                className="me-3"
                                                defaultChecked={false}
                                                {...register("isNatural")}
                                            />
                                            <Form.Label htmlFor="natural-switch" className="mb-0 fw-semibold">
                                                <i className="bi bi-flower1 me-2 text-success"></i>
                                                Natural Orchid
                                            </Form.Label>
                                        </div>
                                        <small className="text-muted">
                                            Toggle if this is a naturally grown orchid (not industry produced)
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
                                            <Card.Body>
                                                <small className="text-muted">
                                                    <i className="bi bi-info-circle me-1"></i>
                                                    Image preview will update as you type the URL
                                                </small>
                                            </Card.Body>
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
                                    disabled={isSubmitting || categories.length === 0}
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

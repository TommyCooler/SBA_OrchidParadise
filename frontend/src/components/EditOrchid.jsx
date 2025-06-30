import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Button, Col, Form, FormGroup, Image, Row, Card, Spinner, Alert } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router';
import { OrchidService, CategoryService } from '../services';

// Mock data for testing when API fails
const mockOrchids = [
  {
    orchidId: "1",
    orchidName: "Phalaenopsis Orchid",
    orchidDescription: "Beautiful white phalaenopsis orchid with elegant petals",
    orchidUrl: "https://images.unsplash.com/photo-1566550747935-21b4605d282d?w=500",
    price: 25.99,
    isNatural: true,
    categoryId: 1
  },
  {
    orchidId: "2", 
    orchidName: "Cattleya Orchid",
    orchidDescription: "Vibrant purple cattleya orchid with large blooms",
    orchidUrl: "https://images.unsplash.com/photo-1567014749344-506469721e67?w=500",
    price: 45.50,
    isNatural: false,
    categoryId: 2
  }
];

export default function EditOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [api, setAPI] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm();
  const watchedImage = watch('orchidUrl');

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchOrchidData(), fetchCategories()]);
    };
    fetchData();
  }, [id, setValue]);

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

  const fetchOrchidData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      const orchidData = await OrchidService.getOrchidById(id);
      setAPI(orchidData);
      
      // Set form values with the complete orchid data
      setValue('orchidName', orchidData.orchidName || '');
      setValue('orchidDescription', orchidData.orchidDescription || '');
      setValue('orchidUrl', orchidData.orchidUrl || orchidData.image || '');
      setValue('price', orchidData.price || '');
      setValue('isNatural', orchidData.isNatural || false);
      setValue('categoryId', orchidData.categoryId || '');
      
      setUsingMockData(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Use mock data if API fails
      const mockOrchid = mockOrchids.find(orchid => orchid.orchidId === id);
      if (mockOrchid) {
        setAPI(mockOrchid);
        setValue('orchidName', mockOrchid.orchidName);
        setValue('orchidDescription', mockOrchid.orchidDescription);
        setValue('orchidUrl', mockOrchid.orchidUrl);
        setValue('price', mockOrchid.price);
        setValue('isNatural', mockOrchid.isNatural);
        setValue('categoryId', mockOrchid.categoryId);
        setUsingMockData(true);
        toast.error('API unavailable. Using test data.');
      } else {
        // Generate random mock data if specific ID not found
        const randomMockData = {
          orchidId: id,
          orchidName: `Test Orchid #${id}`,
          orchidDescription: `Description for test orchid #${id}`,
          orchidUrl: `https://ui-avatars.com/api/?name=Orchid+${id}&background=random&size=400`,
          price: Math.floor(Math.random() * 100) + 10,
          isNatural: Math.random() > 0.5,
          categoryId: 1
        };
        setAPI(randomMockData);
        setValue('orchidName', randomMockData.orchidName);
        setValue('orchidDescription', randomMockData.orchidDescription);
        setValue('orchidUrl', randomMockData.orchidUrl);
        setValue('price', randomMockData.price);
        setValue('isNatural', randomMockData.isNatural);
        setValue('categoryId', randomMockData.categoryId);
        setUsingMockData(true);
        toast.error('API unavailable. Generated test data.');
      }
    } finally {
      setLoading(false);
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
        isNatural: Boolean(data.isNatural),
        categoryId: parseInt(data.categoryId)
      };

      console.log('Updating orchid with request:', orchidRequest);

      if (!usingMockData) {
        // Try real API update
        await OrchidService.updateOrchid(id, orchidRequest);
        toast.success('Orchid updated successfully!');
      } else {
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Mock update completed successfully!');
      }
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error updating orchid:', error);
      toast.error(error.message || 'Failed to update orchid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="light" size="lg" />
          <p className="text-white mt-3">Loading orchid data...</p>
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
            <strong>Test Mode:</strong> You are editing mock data. Changes will not be saved to the database.
          </Alert>
        )}
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <Button 
            variant="light" 
            onClick={() => navigate('/')}
            className="mb-3 rounded-pill px-4"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Collection
          </Button>
          <h1 className="display-5 text-white fw-bold mb-2">
            <i className="bi bi-pencil-square me-3"></i>
            Edit Orchid
          </h1>
          <p className="lead text-white-50">
            Update information for: <span className="text-white fw-semibold">{api.orchidName}</span>
            {usingMockData && <span className="badge bg-warning text-dark ms-2">TEST DATA</span>}
          </p>
        </div>

        <Row className="justify-content-center">
          {/* Form Section */}
          <Col lg={10}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <Card.Header 
                className="border-0 py-4"
                style={{ background: usingMockData ? 'linear-gradient(45deg, #ff9800, #f57c00)' : 'linear-gradient(45deg, #667eea, #764ba2)' }}
              >
                <h4 className="text-white mb-0 fw-semibold">
                  <i className="bi bi-flower1 me-2"></i>
                  Orchid Details
                  {usingMockData && <span className="badge bg-light text-dark ms-2">MOCK</span>}
                </h4>
              </Card.Header>
              
              <Card.Body className="p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    {/* Left Column - Form Fields */}
                    <Col md={8}>
                      {/* Orchid Name */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">
                          <i className="bi bi-tag me-2 text-primary"></i>
                          Orchid Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter orchid name..."
                          className="rounded-pill px-4 py-3"
                          style={{ fontSize: '1.1rem' }}
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
                          <div className="text-danger small mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.orchidName.message}
                          </div>
                        )}
                      </Form.Group>

                      {/* Orchid Description */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">
                          <i className="bi bi-file-text me-2 text-primary"></i>
                          Description *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter orchid description..."
                          className="rounded-3 px-4 py-3"
                          style={{ fontSize: '1.1rem' }}
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
                          <div className="text-danger small mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.orchidDescription.message}
                          </div>
                        )}
                      </Form.Group>

                      {/* Image URL */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">
                          <i className="bi bi-image me-2 text-primary"></i>
                          Image URL *
                        </Form.Label>
                        <Form.Control 
                          type="url" 
                          placeholder="https://example.com/orchid-image.jpg"
                          className="rounded-pill px-4 py-3"
                          style={{ fontSize: '1.1rem' }}
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
                          <div className="text-danger small mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.orchidUrl.message}
                          </div>
                        )}
                      </Form.Group>

                      {/* Price */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">
                          <i className="bi bi-currency-dollar me-2 text-primary"></i>
                          Price *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          className="rounded-pill px-4 py-3"
                          style={{ fontSize: '1.1rem' }}
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
                          <div className="text-danger small mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.price.message}
                          </div>
                        )}
                      </Form.Group>

                      {/* Category Selection */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">
                          <i className="bi bi-folder me-2 text-primary"></i>
                          Category *
                        </Form.Label>
                        <Form.Select
                          className="rounded-pill px-4 py-3"
                          style={{ fontSize: '1.1rem' }}
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
                          <div className="text-danger small mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.categoryId.message}
                          </div>
                        )}
                      </Form.Group>

                      {/* Natural Switch */}
                      <Form.Group className="mb-5">
                        <div className="d-flex align-items-center p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                          <Form.Check
                            type="switch"
                            id="natural-switch"
                            className="me-3"
                            size="lg"
                            {...register("isNatural")}
                          />
                          <div>
                            <Form.Label htmlFor="natural-switch" className="mb-0 fw-semibold">
                              <i className="bi bi-flower1 me-2 text-success"></i>
                              Natural Orchid
                            </Form.Label>
                            <div className="small text-muted">
                              Toggle if this is a naturally grown orchid (not industry produced)
                            </div>
                          </div>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* Right Column - Image Preview */}
                    <Col md={4}>
                      <div className="sticky-top" style={{ top: '2rem' }}>
                        <h6 className="fw-semibold mb-3 text-center">
                          <i className="bi bi-eye me-2"></i>
                          Preview
                        </h6>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                          <div className="position-relative">
                            <Image 
                              src={watchedImage || api.orchidUrl || api.image || "https://via.placeholder.com/300x200?text=No+Image"} 
                              className="w-100"
                              style={{ 
                                height: '200px', 
                                objectFit: 'cover',
                                filter: 'brightness(0.9)'
                              }}
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(api.orchidName || 'Orchid')}&background=random&size=300`;
                              }}
                            />
                            <div 
                              className="position-absolute top-0 start-0 w-100 h-100"
                              style={{
                                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)'
                              }}
                            ></div>
                            {usingMockData && (
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className="badge bg-warning text-dark">MOCK</span>
                              </div>
                            )}
                          </div>
                          <Card.Body className="text-center py-3">
                            <h6 className="mb-1">{api.orchidName}</h6>
                            <small className="text-muted">
                              {api.isNatural ? (
                                <><i className="bi bi-flower1 me-1 text-success"></i>Natural</>
                              ) : (
                                <><i className="bi bi-gear me-1 text-warning"></i>Industry</>
                              )}
                            </small>
                            {api.price && (
                              <div className="mt-1">
                                <span className="badge bg-primary">${api.price}</span>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </div>
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/')}
                      className="rounded-pill px-4 py-2"
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={isSubmitting || categories.length === 0}
                      className="rounded-pill px-5 py-2"
                      style={{ 
                        background: usingMockData ? 
                          'linear-gradient(45deg, #ff9800, #f57c00)' : 
                          'linear-gradient(45deg, #667eea, #764ba2)',
                        border: 'none',
                        minWidth: '120px'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          {usingMockData ? 'Simulating...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          {usingMockData ? 'Test Update' : 'Update Orchid'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

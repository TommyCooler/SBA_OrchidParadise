import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Button, Col, Form, FormGroup, Image, Row, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router';

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
  }
];

export default function EditOrchid() {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const { id } = useParams();
  const navigate = useNavigate();
  const [api, setAPI] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm();
  const watchedImage = watch('image');

  useEffect(() => {
    const fetchOrchidData = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const response = await axios.get(`${baseUrl}/${id}`);
        setAPI(response.data);
        setValue('orchidName', response.data.orchidName);
        setValue('image', response.data.image);
        setValue('isNatural', response.data.isNatural);
        setUsingMockData(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Use mock data if API fails
        const mockOrchid = mockOrchids.find(orchid => orchid.id === id);
        if (mockOrchid) {
          setAPI(mockOrchid);
          setValue('orchidName', mockOrchid.orchidName);
          setValue('image', mockOrchid.image);
          setValue('isNatural', mockOrchid.isNatural);
          setUsingMockData(true);
          toast.error('API unavailable. Using test data.');
        } else {
          // Generate random mock data if specific ID not found
          const randomMockData = {
            id: id,
            orchidName: `Test Orchid #${id}`,
            image: `https://ui-avatars.com/api/?name=Orchid+${id}&background=random&size=400`,
            isNatural: Math.random() > 0.5
          };
          setAPI(randomMockData);
          setValue('orchidName', randomMockData.orchidName);
          setValue('image', randomMockData.image);
          setValue('isNatural', randomMockData.isNatural);
          setUsingMockData(true);
          toast.error('API unavailable. Generated test data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrchidData();
  }, [id, setValue, baseUrl]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (!usingMockData) {
        // Try real API update
        await axios.put(`${baseUrl}/${id}`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
        toast.success('Orchid edited successfully!');
      } else {
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Mock edit completed successfully!');
      }
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to edit orchid.');
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
          <Col lg={8}>
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
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">
                          <i className="bi bi-tag me-2 text-primary"></i>
                          Orchid Name
                        </Form.Label>
                        <Controller
                          name="orchidName"
                          control={control}
                          rules={{ required: "Orchid name is required" }}
                          render={({ field }) => (
                            <Form.Control 
                              {...field} 
                              type="text" 
                              placeholder="Enter orchid name..."
                              className="rounded-pill px-4 py-3"
                              style={{ fontSize: '1.1rem' }}
                            />
                          )}
                        />
                        {errors.orchidName && (
                          <div className="text-danger small mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.orchidName.message}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">
                          <i className="bi bi-image me-2 text-primary"></i>
                          Image URL
                        </Form.Label>
                        <Controller
                          name="image"
                          control={control}
                          rules={{ 
                            required: "Image URL is required",
                            pattern: {
                              value: /(https?:\/\/[^\s]+)/i,
                              message: "Please enter a valid URL"
                            }
                          }}
                          render={({ field }) => (
                            <Form.Control 
                              {...field} 
                              type="text" 
                              placeholder="https://example.com/orchid-image.jpg"
                              className="rounded-pill px-4 py-3"
                              style={{ fontSize: '1.1rem' }}
                            />
                          )}
                        />
                        {errors.image && (
                          <div className="text-danger small mt-2">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.image.message}
                          </div>
                        )}
                      </Form.Group>

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
                              Toggle if this is a naturally grown orchid
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
                              src={watchedImage || api.image} 
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
                      disabled={isSubmitting}
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
                          {usingMockData ? 'Simulating...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          {usingMockData ? 'Test Save' : 'Save Changes'}
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

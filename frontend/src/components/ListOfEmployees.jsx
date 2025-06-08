import React, { useEffect, useState } from "react";
import { Table, Container, Button, Form, FormGroup, Image, Modal, Card, Row, Col, Badge, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

// Mock data for testing when API fails
const mockEmployees = [
  {
    id: 1,
    empId: "EMP001",
    name: "John Smith",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    gender: true,
    designation: "Orchid Care Specialist"
  },
  {
    id: 2,
    empId: "EMP002", 
    name: "Sarah Johnson",
    url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
    gender: false,
    designation: "Orchid Breeding Expert"
  },
  {
    id: 3,
    empId: "EMP003",
    name: "Michael Brown",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    gender: true,
    designation: "Greenhouse Manager"
  },
  {
    id: 4,
    empId: "EMP004",
    name: "Emily Davis",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    gender: false,
    designation: "Plant Disease Analyst"
  },
  {
    id: 5,
    empId: "EMP005",
    name: "David Wilson",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    gender: true,
    designation: "Orchid Propagation Technician"
  }
];

export default function ListOfEmployees() {
  const baseUrl = import.meta.env.VITE_API_URL_EMPL;
  const [api, setAPI] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch
  } = useForm();
  
  const watchedImage = watch('url');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl);
      const sortedData = response.data.sort(
        (a, b) => parseInt(b.empId) - parseInt(a.empId)
      );
      setAPI(sortedData);
      setUsingMockData(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAPI(mockEmployees);
      setUsingMockData(true);
      // toast.error("Using mock data due to API error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!usingMockData) {
        await axios.delete(`${baseUrl}/${id}`);
        toast.success("Employee deleted successfully!");
      } else {
        setAPI(prev => prev.filter(emp => emp.id !== id));
        toast.success("Mock employee deleted!");
      }
      if (!usingMockData) fetchData();
    } catch (error) {
      console.log(error.message);
      toast.error("Employee deletion failed!");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (!usingMockData) {
        await axios.post(baseUrl, data, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Employee added successfully!");
      } else {
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newEmployee = {
          ...data,
          id: Math.max(...api.map(e => e.id), 0) + 1,
          empId: `EMP${String(Math.max(...api.map(e => parseInt(e.empId.slice(3))), 0) + 1).padStart(3, '0')}`
        };
        setAPI(prev => [newEmployee, ...prev]);
        toast.success("Mock employee added successfully!");
      }
      
      setShow(false);
      reset();
      if (!usingMockData) fetchData();
    } catch (error) {
      console.log(error.message);
      toast.error("Employee addition failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="light" size="lg" />
          <p className="text-white mt-3">Loading employees...</p>
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
            <strong>Test Mode:</strong> You are viewing mock orchid care team data. API is unavailable.
          </Alert>
        )}
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 text-white fw-bold mb-3">
            🌺 Orchid Care Team
          </h1>
          <p className="lead text-white-50 mb-4">
            Manage your orchid care specialists and their expertise
          </p>
          <Button 
            variant="light" 
            size="lg"
            onClick={handleShow}
            className="px-4 py-2 rounded-pill shadow-lg"
            style={{ 
              background: 'linear-gradient(45deg, #28a745, #20c997)',
              border: 'none',
              color: 'white'
            }}
          >
            <i className="bi bi-person-plus me-2"></i>
            Add Team Member
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
                    <small className="text-muted">Total Team Members</small>
                  </Col>
                  <Col md={4}>
                    <h3 className="text-info mb-0">{api.filter(e => e.gender).length}</h3>
                    <small className="text-muted">Male</small>
                  </Col>
                  <Col md={4}>
                    <h3 className="text-danger mb-0">{api.filter(e => !e.gender).length}</h3>
                    <small className="text-muted">Female</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Employee Table */}
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
          <Card.Header 
            className="border-0 py-4"
            style={{ background: 'linear-gradient(45deg, #28a745, #20c997)' }}
          >
            <Row className="align-items-center">
              <Col>
                <h4 className="text-white mb-0 fw-semibold">
                  <i className="bi bi-people me-2"></i>
                  Orchid Care Team Directory
                  {usingMockData && <span className="badge bg-warning text-dark ms-2">MOCK DATA</span>}
                </h4>
              </Col>
              <Col xs="auto">
                <Badge bg="light" text="dark" className="px-3 py-2">
                  {api.length} Specialist{api.length !== 1 ? 's' : ''}
                </Badge>
              </Col>
            </Row>
          </Card.Header>
          
          <Card.Body className="p-0">
            {api.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people display-1 d-block mb-3 text-muted"></i>
                <h4 className="text-muted">No team members found</h4>
                <p className="text-muted">Start by adding your first orchid care specialist!</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0">
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th className="border-0 py-3 px-4">#</th>
                    <th className="border-0 py-3">Photo</th>
                    <th className="border-0 py-3">Employee ID</th>
                    <th className="border-0 py-3">Full Name</th>
                    <th className="border-0 py-3">Gender</th>
                    <th className="border-0 py-3">Specialization</th>
                    <th className="border-0 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {api.map((employee, index) => (
                    <tr 
                      key={employee.id}
                      style={{
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td className="border-0 py-3 px-4 align-middle">
                        <span className="fw-semibold text-muted">{index + 1}</span>
                      </td>
                      <td className="border-0 py-3 align-middle">
                        <div className="position-relative">
                          <Image
                            src={employee.url}
                            roundedCircle
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=50`;
                            }}
                          />
                          {usingMockData && (
                            <Badge 
                              bg="warning" 
                              className="position-absolute top-0 start-100 translate-middle"
                              style={{ fontSize: '0.6rem' }}
                            >
                              M
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="border-0 py-3 align-middle">
                        <span className="fw-semibold text-primary">{employee.empId}</span>
                      </td>
                      <td className="border-0 py-3 align-middle">
                        <div>
                          <div className="fw-semibold">{employee.name}</div>
                        </div>
                      </td>
                      <td className="border-0 py-3 align-middle">
                        <Badge 
                          className={`px-3 py-2 rounded-pill ${
                            employee.gender ? 'bg-info' : 'bg-danger'
                          }`}
                        >
                          <i className={`bi ${employee.gender ? 'bi-gender-male' : 'bi-gender-female'} me-1`}></i>
                          {employee.gender ? 'Male' : 'Female'}
                        </Badge>
                      </td>
                      <td className="border-0 py-3 align-middle">
                        <div className="text-muted">
                          <i className="bi bi-flower1 me-2 text-success"></i>
                          {employee.designation}
                        </div>
                      </td>
                      <td className="border-0 py-3 align-middle text-center">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="rounded-pill"
                          onClick={() => {
                            if(confirm(`Are you sure you want to remove ${employee.name} from the team?`)) {
                              handleDelete(employee.id);
                            }
                          }}
                          style={{
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <i className="bi bi-trash3"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

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
            style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
          >
            <Modal.Title className="text-white fw-bold">
              <i className="bi bi-person-plus me-2"></i>
              Add Team Member
              {usingMockData && <span className="badge bg-light text-dark ms-2">MOCK</span>}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-person me-2"></i>Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter team member name..."
                      className="rounded-pill px-3"
                      autoFocus
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <div className="text-danger small mt-1">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.name.message}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-image me-2"></i>Profile Image URL
                    </Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="https://example.com/profile-image.jpg"
                      className="rounded-pill px-3"
                      {...register("url", {
                        required: "Image URL is required",
                        pattern: {
                          value: /(https?:\/\/[^\s]+)/i,
                          message: "Please enter a valid URL"
                        }
                      })}
                    />
                    {errors.url && (
                      <div className="text-danger small mt-1">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.url.message}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-flower1 me-2"></i>Orchid Care Specialization
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="rounded-pill px-3"
                      {...register("designation", { required: "Specialization is required" })}
                    >
                      <option value="">Select specialization...</option>
                      <option value="Orchid Care Specialist">Orchid Care Specialist</option>
                      <option value="Orchid Breeding Expert">Orchid Breeding Expert</option>
                      <option value="Greenhouse Manager">Greenhouse Manager</option>
                      <option value="Plant Disease Analyst">Plant Disease Analyst</option>
                      <option value="Orchid Propagation Technician">Orchid Propagation Technician</option>
                      <option value="Orchid Nutrition Specialist">Orchid Nutrition Specialist</option>
                      <option value="Orchid Research Scientist">Orchid Research Scientist</option>
                      <option value="Orchid Hybridization Expert">Orchid Hybridization Expert</option>
                      <option value="Climate Control Specialist">Climate Control Specialist</option>
                      <option value="Orchid Exhibition Coordinator">Orchid Exhibition Coordinator</option>
                    </Form.Control>
                    {errors.designation && (
                      <div className="text-danger small mt-1">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.designation.message}
                      </div>
                    )}
                    <small className="text-muted">
                      Choose the team member's area of expertise in orchid care
                    </small>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="switch"
                        id="gender-switch"
                        className="me-3"
                        {...register("gender")}
                      />
                      <Form.Label htmlFor="gender-switch" className="mb-0 fw-semibold">
                        <i className="bi bi-gender-male me-2 text-info"></i>
                        Male Team Member
                      </Form.Label>
                    </div>
                    <small className="text-muted">
                      Toggle if this team member is male
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
                    <div className="mt-3 text-center">
                      <small className="text-muted">
                        <i className="bi bi-flower1 me-1"></i>
                        Orchid Care Team Member
                      </small>
                    </div>
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
                    background: 'linear-gradient(45deg, #28a745, #20c997)',
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
                      Add to Team
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

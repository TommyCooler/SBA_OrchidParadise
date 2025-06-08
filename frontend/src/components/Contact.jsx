import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaStar,
  FaLeaf,
  FaUsers,
  FaHandshake,
  FaPaperPlane,
  FaCheck,
  FaQuestionCircle
} from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setAlertType('success');
      setShowAlert(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: ''
      });
      
      setIsSubmitting(false);
      setTimeout(() => setShowAlert(false), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: FaPhone,
      title: "Call Us",
      info: "+84 (0) 123 456 789",
      subtitle: "Mon - Fri, 9AM - 6PM",
      color: "#28a745",
      gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      info: "hello@orchidparadise.com",
      subtitle: "We respond within 24h",
      color: "#007bff",
      gradient: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Our Greenhouse",
      info: "123 Orchid Garden District",
      subtitle: "Ho Chi Minh City, Vietnam",
      color: "#dc3545",
      gradient: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)"
    },
    {
      icon: FaClock,
      title: "Business Hours",
      info: "Monday - Friday",
      subtitle: "9:00 AM - 6:00 PM",
      color: "#ffc107",
      gradient: "linear-gradient(135deg, #ffc107 0%, #e0a800 100%)"
    }
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "orchid-care", label: "Orchid Care Advice" },
    { value: "purchase", label: "Purchase Inquiry" },
    { value: "partnership", label: "Business Partnership" },
    { value: "support", label: "Technical Support" },
    { value: "other", label: "Other" }
  ];

  const features = [
    {
      icon: FaLeaf,
      title: "Expert Consultation",
      description: "Get personalized advice from our orchid specialists"
    },
    {
      icon: FaUsers,
      title: "Community Support",
      description: "Join our community of orchid enthusiasts"
    },
    {
      icon: FaHandshake,
      title: "Partnership Opportunities",
      description: "Explore business collaborations with us"
    }
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: "#", color: "#1877f2", name: "Facebook" },
    { icon: FaTwitter, url: "#", color: "#1da1f2", name: "Twitter" },
    { icon: FaInstagram, url: "#", color: "#e4405f", name: "Instagram" },
    { icon: FaLinkedinIn, url: "#", color: "#0077b5", name: "LinkedIn" }
  ];

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <Badge 
                bg="light" 
                text="dark" 
                className="px-3 py-2 rounded-pill mb-3"
                style={{ fontSize: '0.9rem' }}
              >
                <FaLeaf className="me-2" />
                Contact Orchid Paradise
              </Badge>
              <h1 className="display-4 fw-bold text-white mb-4">
                Let's Grow Together
              </h1>
              <p className="lead text-white-50 mb-5">
                Have questions about orchids? Need expert advice? Want to start your orchid journey? 
                We're here to help you every step of the way.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Methods */}
      <section className="py-5">
        <Container>
          <Row className="g-4 mb-5">
            {contactMethods.map((method, index) => (
              <Col key={index} md={6} lg={3}>
                <Card 
                  className="border-0 shadow-lg rounded-4 h-100 text-center"
                  style={{
                    background: method.gradient,
                    color: 'white',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Card.Body className="p-4">
                    <method.icon size={40} className="mb-3" />
                    <h5 className="fw-bold mb-2">{method.title}</h5>
                    <p className="mb-1 fw-semibold">{method.info}</p>
                    <small className="opacity-75">{method.subtitle}</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <Container>
          <Row className="g-5">
            {/* Contact Form */}
            <Col lg={8}>
              <Card className="border-0 shadow-lg rounded-4">
                <Card.Header 
                  className="border-0 py-4 text-center"
                  style={{ background: 'linear-gradient(45deg, #28a745, #20c997)' }}
                >
                  <h3 className="text-white mb-0 fw-bold">
                    <FaPaperPlane className="me-2" />
                    Send Us a Message
                  </h3>
                </Card.Header>
                <Card.Body className="p-5">
                  {showAlert && (
                    <Alert variant={alertType} className="mb-4 rounded-4">
                      <FaCheck className="me-2" />
                      <strong>Success!</strong> Your message has been sent. We'll get back to you within 24 hours.
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-person me-2"></i>
                            Full Name *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="rounded-pill px-3"
                            style={{ height: '50px' }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-envelope me-2"></i>
                            Email Address *
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className="rounded-pill px-3"
                            style={{ height: '50px' }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-telephone me-2"></i>
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+84 123 456 789"
                            className="rounded-pill px-3"
                            style={{ height: '50px' }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaQuestionCircle className="me-2" />
                            Inquiry Type *
                          </Form.Label>
                          <Form.Select
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleChange}
                            required
                            className="rounded-pill px-3"
                            style={{ height: '50px' }}
                          >
                            <option value="">Select inquiry type...</option>
                            {inquiryTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-chat-text me-2"></i>
                            Your Message *
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={6}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us more about your inquiry, what orchids you're interested in, or how we can help you..."
                            required
                            className="rounded-4 px-3"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-center mt-4">
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="px-5 py-3 rounded-pill"
                        style={{ 
                          background: 'linear-gradient(45deg, #28a745, #20c997)',
                          border: 'none',
                          minWidth: '200px'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              <div className="sticky-top" style={{ top: '2rem' }}>
                {/* Why Contact Us */}
                <Card className="border-0 shadow-lg rounded-4 mb-4">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">
                      <FaStar className="me-2 text-warning" />
                      Why Contact Us?
                    </h5>
                    <div className="d-flex flex-column gap-3">
                      {features.map((feature, index) => (
                        <div key={index} className="d-flex align-items-start">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              color: 'white'
                            }}
                          >
                            <feature.icon size={16} />
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1">{feature.title}</h6>
                            <small className="text-muted">{feature.description}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Social Media */}
                <Card className="border-0 shadow-lg rounded-4 mb-4">
                  <Card.Body className="p-4 text-center">
                    <h5 className="fw-bold mb-4">Follow Our Journey</h5>
                    <div className="d-flex justify-content-center gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '50px', 
                            height: '50px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = social.color;
                            e.currentTarget.style.borderColor = social.color;
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = '#6c757d';
                            e.currentTarget.style.color = '#6c757d';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title={social.name}
                        >
                          <social.icon size={18} />
                        </a>
                      ))}
                    </div>
                    <p className="text-muted small mt-3 mb-0">
                      Join our community of orchid lovers and get daily inspiration!
                    </p>
                  </Card.Body>
                </Card>

                {/* Quick Tips */}
                <Card className="border-0 shadow-lg rounded-4">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3">
                      <FaLeaf className="me-2 text-success" />
                      Quick Tip
                    </h5>
                    <div 
                      className="p-3 rounded-3"
                      style={{ background: 'linear-gradient(45deg, #e8f5e8, #f0f8f0)' }}
                    >
                      <p className="mb-0 small">
                        <strong>New to orchids?</strong> Start with Phalaenopsis - 
                        they're perfect for beginners and bloom for months with proper care!
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <Container>
          <Card 
            className="border-0 shadow-lg rounded-4 text-center"
            style={{ background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)' }}
          >
            <Card.Body className="p-5">
              <h3 className="text-white fw-bold mb-3">
                Ready to Start Your Orchid Adventure?
              </h3>
              <p className="text-white mb-4">
                Don't wait! Join thousands of satisfied customers who have transformed 
                their spaces with our beautiful orchids.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button 
                  size="lg" 
                  variant="light"
                  className="rounded-pill px-4"
                >
                  <FaLeaf className="me-2" />
                  Browse Orchids
                </Button>
                <Button 
                  size="lg" 
                  variant="outline-light"
                  className="rounded-pill px-4"
                >
                  <FaUsers className="me-2" />
                  Join Community
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaLeaf, 
  FaUsers, 
  FaHeart, 
  FaGlobe, 
  FaStar, 
  FaAward,
  FaQuoteLeft,
  FaArrowRight,
  FaCheck,
  FaRocket,
  FaEye,
  FaHandshake,
  FaPlay,
  FaLightbulb,
  FaShieldAlt,
  FaInfinity,
  FaChartLine,
  FaCamera,
  FaCertificate,
  FaMedal
} from 'react-icons/fa';
import './About.css';

export default function About() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('story');
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Company data
  const companyData = {
    founded: "2009",
    employees: "200+",
    countries: "50+",
    species: "500+",
    customers: "10,000+"
  };

  const milestones = [
    {
      year: "2009",
      title: "Foundation",
      description: "Started with a small greenhouse and big dreams",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
      achievement: "First rare orchid collection"
    },
    {
      year: "2015",
      title: "Digital Expansion",
      description: "Launched e-commerce platform and mobile app",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      achievement: "10,000+ online customers"
    },
    {
      year: "2020",
      title: "Global Recognition",
      description: "Awarded International Botanical Excellence Award",
      image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=400&h=250&fit=crop",
      achievement: "ISO 9001 Certification"
    },
    {
      year: "2024",
      title: "Innovation Leader",
      description: "Leading sustainable cultivation practices worldwide",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=250&fit=crop",
      achievement: "Carbon Neutral Operations"
    }
  ];

  const expertise = [
    {
      icon: FaLeaf,
      title: "Rare Species Cultivation",
      description: "Specializing in endangered and exotic orchid varieties",
      expertise: "95%",
      color: "#2ECC71"
    },
    {
      icon: FaLightbulb,
      title: "Research & Development",
      description: "Pioneering new growing techniques and technologies",
      expertise: "90%",
      color: "#F39C12"
    },
    {
      icon: FaGlobe,
      title: "Global Distribution",
      description: "Worldwide shipping with perfect plant condition guarantee",
      expertise: "98%",
      color: "#3498DB"
    },
    {
      icon: FaShieldAlt,
      title: "Quality Assurance",
      description: "Rigorous testing and certification for every plant",
      expertise: "99%",
      color: "#E74C3C"
    }
  ];

  const team = [
    {
      id: 1,
      name: "Dr. Maria Rodriguez",
      position: "Chief Executive Officer",
      specialty: "Orchid Genetics & Research",
      experience: "20+ years",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
      bio: "Leading expert in orchid genetics with PhD from Harvard. Published 50+ research papers on rare orchid species.",
      certifications: ["PhD Plant Biology", "ISO Lead Auditor", "Botanical Research Fellow"],
      awards: ["Botanical Excellence Award 2023", "Research Innovation Prize 2022"]
    },
    {
      id: 2,
      name: "James Chen",
      position: "Head of Operations",
      specialty: "Sustainable Agriculture",
      experience: "15+ years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Master of sustainable cultivation practices with focus on eco-friendly growing methods.",
      certifications: ["Sustainable Agriculture Cert", "Organic Farming License", "Environmental Management"],
      awards: ["Green Innovation Award 2023", "Sustainability Leader 2022"]
    },
    {
      id: 3,
      name: "Sarah Williams",
      position: "Customer Success Director",
      specialty: "Customer Experience",
      experience: "12+ years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Expert in building lasting relationships with orchid enthusiasts worldwide.",
      certifications: ["Customer Success Management", "Digital Marketing Expert", "Community Building"],
      awards: ["Customer Excellence Award 2023", "Community Impact Prize 2022"]
    }
  ];

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  return (
    <div className="about-page-new">
      {/* Modern Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '120px 0 80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }}
        />
        
        <Container style={{ position: 'relative', zIndex: 2 }}>
          {/* Main Title Section */}
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <Badge 
                className="mb-4 px-4 py-2"
                style={{ 
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <FaLeaf className="me-2" />
                About Orchid Paradise
              </Badge>
              
              <h1 className="display-3 fw-bold mb-4" style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                Cultivating Excellence
                <br />
                <span style={{ color: '#FFD700' }}>Since 2009</span>
              </h1>
              
              <p className="lead mb-5" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.3rem', lineHeight: '1.6' }}>
                We are passionate botanists, researchers, and orchid enthusiasts dedicated 
                to bringing you the world's finest orchid collection with unmatched expertise.
              </p>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center mb-5">
                <Button 
                  variant="light"
                  size="lg"
                  className="px-5 py-3 fw-semibold"
                  style={{ borderRadius: '50px' }}
                  onClick={() => navigate('/')}
                >
                  <FaLeaf className="me-2" />
                  Explore Collection
                </Button>
                <Button 
                  variant="outline-light"
                  size="lg"
                  className="px-5 py-3 fw-semibold"
                  style={{ borderRadius: '50px', borderWidth: '2px' }}
                  onClick={() => navigate('/contact')}
                >
                  Get in Touch
                  <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </Col>
          </Row>

          {/* Company Stats Cards */}
          <Row className="justify-content-center">
            <Col lg={10}>
              <Row className="g-4">
                {Object.entries(companyData).map(([key, value], index) => (
                  <Col key={index} md={6} lg className="text-center">
                    <Card 
                      className="h-100 border-0"
                      style={{ 
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Card.Body className="p-4">
                        <h2 className="fw-bold mb-2" style={{ color: '#FFD700', fontSize: '2.5rem' }}>
                          {value}
                        </h2>
                        <p className="mb-0" style={{ color: 'white', fontSize: '1rem', fontWeight: '500' }}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5" style={{ background: 'linear-gradient(to right, #f8f9fa, #ffffff)' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4" style={{ color: '#2c3e50' }}>
                Our Mission & Vision
              </h2>
              <div className="mb-4">
                <h4 style={{ color: '#28a745' }}>
                  <FaEye className="me-2" />
                  Vision
                </h4>
                <p className="text-muted">
                  To become the world's leading platform for rare and exotic orchid cultivation, 
                  connecting passionate growers with the finest botanical specimens while promoting 
                  sustainable practices.
                </p>
              </div>
              <div>
                <h4 style={{ color: '#28a745' }}>
                  <FaRocket className="me-2" />
                  Mission
                </h4>
                <p className="text-muted">
                  We cultivate exceptional orchids through innovative research, sustainable methods, 
                  and expert care, delivering beauty and knowledge to orchid enthusiasts worldwide.
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&h=400&fit=crop"
                  alt="Orchid Garden"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ width: '100%' }}
                />
                <div 
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(40, 167, 69, 0.9)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <FaPlay size={24} color="white" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tabbed Content Section */}
      <section className="py-5" style={{ background: 'white' }}>
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <Tabs 
                activeKey={activeTab} 
                onSelect={(k) => setActiveTab(k)}
                className="nav-justified custom-tabs"
                style={{ borderBottom: 'none' }}
              >
                <Tab 
                  eventKey="story" 
                  title={
                    <span className="tab-title">
                      <FaHeart className="me-2" />
                      Our Story
                    </span>
                  }
                >
                  <div className="tab-content-area mt-5">
                    <Row className="g-4">
                      {milestones.map((milestone, index) => (
                        <Col key={index} md={6} lg={3}>
                          <Card 
                            className="milestone-card border-0 h-100"
                            style={{ 
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div className="position-relative">
                              <img 
                                src={milestone.image}
                                alt={milestone.title}
                                className="card-img-top"
                                style={{ height: '180px', objectFit: 'cover' }}
                              />
                              <Badge 
                                className="position-absolute top-0 start-0 m-2"
                                style={{ background: '#28a745' }}
                              >
                                {milestone.year}
                              </Badge>
                            </div>
                            <Card.Body className="p-3">
                              <h5 className="fw-bold mb-2">{milestone.title}</h5>
                              <p className="text-muted small mb-2">{milestone.description}</p>
                              <div className="d-flex align-items-center">
                                <FaMedal className="text-warning me-2" size={16} />
                                <small className="text-success fw-semibold">
                                  {milestone.achievement}
                                </small>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Tab>

                <Tab 
                  eventKey="expertise" 
                  title={
                    <span className="tab-title">
                      <FaLightbulb className="me-2" />
                      Expertise
                    </span>
                  }
                >
                  <div className="tab-content-area mt-5">
                    <Row className="g-4">
                      {expertise.map((item, index) => (
                        <Col key={index} md={6} lg={3}>
                          <Card 
                            className="expertise-card border-0 text-center h-100 p-4"
                            style={{ 
                              background: `${item.color}10`,
                              border: `2px solid ${item.color}20`
                            }}
                          >
                            <div 
                              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                              style={{
                                width: '70px',
                                height: '70px',
                                background: item.color,
                                color: 'white'
                              }}
                            >
                              <item.icon size={28} />
                            </div>
                            <h5 className="fw-bold mb-3">{item.title}</h5>
                            <p className="text-muted mb-3">{item.description}</p>
                            <div className="expertise-meter">
                              <div className="d-flex justify-content-between mb-1">
                                <small>Expertise Level</small>
                                <small className="fw-bold">{item.expertise}</small>
                              </div>
                              <div 
                                className="progress" 
                                style={{ height: '8px', background: '#e9ecef' }}
                              >
                                <div 
                                  className="progress-bar"
                                  style={{ 
                                    width: item.expertise,
                                    background: item.color
                                  }}
                                />
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Tab>

                <Tab 
                  eventKey="team" 
                  title={
                    <span className="tab-title">
                      <FaUsers className="me-2" />
                      Our Team
                    </span>
                  }
                >
                  <div className="tab-content-area mt-5">
                    <Row className="g-4 justify-content-center">
                      {team.map((member) => (
                        <Col key={member.id} md={6} lg={4}>
                          <Card 
                            className="team-card border-0 h-100 position-relative"
                            style={{ 
                              cursor: 'pointer',
                              boxShadow: hoveredCard === member.id ? 
                                '0 10px 25px rgba(0,0,0,0.15)' : 
                                '0 4px 6px rgba(0,0,0,0.1)',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => handleMemberClick(member)}
                            onMouseEnter={() => setHoveredCard(member.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                          >
                            <div className="text-center pt-4">
                              <div className="position-relative d-inline-block">
                                <img 
                                  src={member.image}
                                  alt={member.name}
                                  className="rounded-circle"
                                  style={{ 
                                    width: '120px', 
                                    height: '120px', 
                                    objectFit: 'cover',
                                    border: '4px solid #f8f9fa'
                                  }}
                                />
                                <div 
                                  className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: '35px',
                                    height: '35px',
                                    background: '#28a745',
                                    color: 'white'
                                  }}
                                >
                                  <FaCamera size={14} />
                                </div>
                              </div>
                            </div>
                            
                            <Card.Body className="text-center">
                              <h5 className="fw-bold mb-1">{member.name}</h5>
                              <p className="text-primary mb-2 fw-semibold">{member.position}</p>
                              <Badge bg="light" text="dark" className="mb-3">
                                {member.specialty}
                              </Badge>
                              
                              <div className="d-flex justify-content-center align-items-center mb-3">
                                <FaStar className="text-warning me-2" />
                                <small className="text-muted">{member.experience} experience</small>
                              </div>
                              
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="rounded-pill px-3"
                              >
                                View Profile
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="fw-bold mb-4">Ready to Start Your Orchid Journey?</h2>
              <p className="lead text-muted mb-4">
                Join thousands of satisfied customers who trust us with their orchid passion.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Button 
                  variant="success"
                  size="lg"
                  className="px-4"
                  onClick={() => navigate('/')}
                >
                  <FaLeaf className="me-2" />
                  Browse Collection
                </Button>
                <Button 
                  variant="outline-primary"
                  size="lg"
                  className="px-4"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                  <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Member Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedMember && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedMember.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={4} className="text-center">
                  <img 
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="img-fluid rounded-3 mb-3"
                  />
                  <h5>{selectedMember.position}</h5>
                  <Badge bg="primary" className="mb-2">{selectedMember.specialty}</Badge>
                </Col>
                <Col md={8}>
                  <h6>Biography</h6>
                  <p className="text-muted mb-3">{selectedMember.bio}</p>
                  
                  <h6>Certifications</h6>
                  <div className="mb-3">
                    {selectedMember.certifications.map((cert, index) => (
                      <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                        <FaCertificate className="me-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  
                  <h6>Awards & Recognition</h6>
                  <div>
                    {selectedMember.awards.map((award, index) => (
                      <Badge key={index} bg="warning" text="dark" className="me-1 mb-1">
                        <FaAward className="me-1" />
                        {award}
                      </Badge>
                    ))}
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>

      <style jsx>{`
        .custom-tabs .nav-link {
          border: none;
          color: #6c757d;
          font-weight: 500;
          padding: 1rem 2rem;
        }
        
        .custom-tabs .nav-link.active {
          color: #28a745;
          background: none;
          border-bottom: 3px solid #28a745;
        }
        
        .tab-title {
          font-size: 1rem;
        }
        
        .team-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}
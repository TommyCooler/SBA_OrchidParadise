import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import OrderDetailService from '../services/orderDetailService';

export default function OrderDetail() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { order_id } = useParams();

  useEffect(() => {
    fetchOrderDetails();
  }, [order_id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderDetailService.getOrderDetailByOrderID(order_id);
      setOrderDetails(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    return orderDetails.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalQuantity = () => {
    return orderDetails.reduce((total, item) => total + item.quantity, 0);
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
          <p className="text-white mt-3">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="display-4 text-white fw-bold mb-3">
            <i className="bi bi-receipt me-3"></i>
            Order Details
          </h1>
          <p className="lead text-white-50">
            Order #{order_id} - Item Details
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <Alert variant="danger" className="rounded-4 shadow">
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error Loading Order Details
              </Alert.Heading>
              <p className="mb-0">{error}</p>
              <hr />
              <Button variant="outline-danger" size="sm" onClick={fetchOrderDetails}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try Again
              </Button>
            </Alert>
          </motion.div>
        )}

        {/* No Order Details */}
        {!loading && !error && orderDetails.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Card.Body>
                <div className="mb-4">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                </div>
                <h3 className="mb-3">No Order Details Found</h3>
                <p className="text-muted mb-4">
                  No items found for this order.
                </p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="rounded-pill px-4"
                  onClick={() => navigate('/orders')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Orders
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Order Details */}
        {!loading && !error && orderDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Summary Cards */}
            {/* <Row className="mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 text-center">
                  <Card.Body className="py-3">
                    <h4 className="text-primary mb-1">{orderDetails.length}</h4>
                    <small className="text-muted">Total Items</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 text-center">
                  <Card.Body className="py-3">
                    <h4 className="text-info mb-1">{calculateTotalQuantity()}</h4>
                    <small className="text-muted">Total Quantity</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 text-center">
                  <Card.Body className="py-3">
                    <h4 className="text-success mb-1">${calculateTotalAmount().toFixed(2)}</h4>
                    <small className="text-muted">Total Amount</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row> */}

            {/* Order Items */}
            <Row className="g-4">
              {orderDetails.map((item, idx) => (
                <Col key={idx} lg={6} xl={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      className="h-100 border-0 shadow-lg rounded-4 overflow-hidden"
                      style={{ 
                        transition: 'all 0.3s ease',
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
                      {/* Orchid Image */}
                      {item.orchidUrl && (
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <Card.Img 
                            variant="top" 
                            src={item.orchidUrl} 
                            style={{ 
                              height: '100%', 
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          />
                        </div>
                      )}

                      {/* Card Body */}
                      <Card.Body className="p-4">
                        <div className="mb-3">
                          <h5 className="card-title fw-bold mb-2">
                            <i className="bi bi-flower1 me-2 text-primary"></i>
                            {item.orchidName || 'Unknown Orchid'}
                          </h5>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                              <i className="bi bi-currency-dollar me-2"></i>
                              Unit Price
                            </span>
                            <span className="fw-semibold text-success">
                              ${item.price?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                              <i className="bi bi-hash me-2"></i>
                              Quantity
                            </span>
                            <Badge bg="info" className="px-3 py-2 rounded-pill">
                              {item.quantity || 0}
                            </Badge>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">
                              <i className="bi bi-calculator me-2"></i>
                              Subtotal
                            </span>
                            <span className="fw-bold text-success fs-5">
                              ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar for Quantity */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Quantity</small>
                            <small className="text-muted">{item.quantity} units</small>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-info"
                              style={{ 
                                width: `${Math.min((item.quantity / Math.max(...orderDetails.map(d => d.quantity))) * 100, 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* Order Summary Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-5"
            >
              <Card className="border-0 shadow-lg rounded-4">
                <Card.Header className="bg-primary text-white rounded-top-4">
                  <h5 className="mb-0">
                    <i className="bi bi-list-check me-2"></i>
                    Order Summary
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3">Item</th>
                        <th className="border-0 px-4 py-3 text-center">Quantity</th>
                        <th className="border-0 px-4 py-3 text-end">Unit Price</th>
                        <th className="border-0 px-4 py-3 text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center">
                              {item.orchidUrl && (
                                <img 
                                  src={item.orchidUrl} 
                                  alt={item.orchidName}
                                  className="rounded me-3"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <div className="fw-semibold">{item.orchidName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge bg="info" className="px-3 py-2">
                              {item.quantity}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-end">
                            ${item.price?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-4 py-3 text-end fw-bold text-success">
                            ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr>
                        <td className="px-4 py-3 fw-bold">Total</td>
                        <td className="px-4 py-3 text-center fw-bold">{calculateTotalQuantity()}</td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-end fw-bold text-success fs-5">
                          ${calculateTotalAmount().toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-5"
        >
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="outline-light" 
              size="lg" 
              className="rounded-pill px-4"
              onClick={() => navigate('/orders')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Orders
            </Button>
            <Button 
              variant="light" 
              size="lg" 
              className="rounded-pill px-4"
              onClick={() => navigate('/')}
            >
              <i className="bi bi-house me-2"></i>
              Home
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
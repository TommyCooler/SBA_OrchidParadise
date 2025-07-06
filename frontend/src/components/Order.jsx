import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OrderService from '../services/orderService';
import PaymentService from '../services/paymentService';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getMyOrders();
      console.log('Fetched orders:', data);
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => 
        order.order_status?.toUpperCase() === statusFilter.toUpperCase()
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.order_date);
      const dateB = new Date(b.order_date);
      return dateB - dateA; // Newest first
    });
    
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
      case 'SUCCESS':
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bi-clock';
      case 'CONFIRMED':
      case 'SUCCESS':
      case 'COMPLETED':
        return 'bi-check-circle';
      case 'CANCELLED':
        return 'bi-x-circle';
      default:
        return 'bi-question-circle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order-detail/${orderId}`);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;

    setDeletingOrderId(selectedOrder.order_id);
    try {
      await OrderService.deleteOrder(selectedOrder.order_id);
      setOrders(orders.filter(order => order.order_id !== selectedOrder.order_id));
      setShowDeleteModal(false);
      setSelectedOrder(null);
    } catch (err) {
      setError(err.message || 'Failed to delete order');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const getUniqueStatuses = () => {
    const statuses = orders.map(order => order.order_status?.toUpperCase()).filter(Boolean);
    return [...new Set(statuses)];
  };

  const handlePayment = async (orderId) => {
    try {
      // Gọi API để tạo URL thanh toán
      const response = await PaymentService.createPaymentUrl(orderId);
      console.log('Payment URL response:', response);
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to initiate payment. Please try again.');
    }
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
          <p className="text-white mt-3">Loading your orders...</p>
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
            <i className="bi bi-bag-check me-3"></i>
            My Orders
          </h1>
          <p className="lead text-white-50">
            Track and manage your orchid orders
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
                Error Loading Orders
              </Alert.Heading>
              <p className="mb-0">{error}</p>
              <hr />
              <Button variant="outline-danger" size="sm" onClick={fetchOrders}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try Again
              </Button>
            </Alert>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-exclamation-triangle text-danger me-2"></i>
              Delete Order
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-3">
              Are you sure you want to delete this order?
            </p>
            {selectedOrder && (
              <div className="bg-light p-3 rounded">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Order ID:</span>
                  <span>#{selectedOrder.order_id}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Date:</span>
                  <span>{formatDate(selectedOrder.order_date)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Status:</span>
                  <Badge bg={getStatusColor(selectedOrder.order_status)}>
                    {selectedOrder.order_status}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Amount:</span>
                  <span className="text-success">${selectedOrder.total_amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            )}
            <div className="alert alert-warning mt-3 mb-0">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Warning:</strong> This action cannot be undone.
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDeleteOrder}
              disabled={deletingOrderId === selectedOrder?.order_id}
            >
              {deletingOrderId === selectedOrder?.order_id ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <i className="bi bi-trash me-2"></i>
                  Delete Order
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* No Orders */}
        {!loading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Card.Body>
                <div className="mb-4">
                  <i className="bi bi-cart-x display-1 text-muted"></i>
                </div>
                <h3 className="mb-3">No Orders Yet</h3>
                <p className="text-muted mb-4">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="rounded-pill px-4"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-shop me-2"></i>
                  Start Shopping
                </Button>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Filter Section */}
            <Row className="mb-4">
              <Col md={8}>
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col sm={6}>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-funnel text-primary me-2"></i>
                          <span className="fw-semibold">Filter by Status:</span>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <Form.Select 
                          value={statusFilter} 
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="rounded-pill"
                        >
                          <option value="ALL">All Orders ({orders.length})</option>
                          {getUniqueStatuses().map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0) + status.slice(1).toLowerCase()} ({orders.filter(o => o.order_status?.toUpperCase() === status).length})
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 text-center">
                  <Card.Body className="py-3">
                    <h4 className="text-primary mb-1">{filteredOrders.length}</h4>
                    <small className="text-muted">
                      {statusFilter === 'ALL' ? 'Total Orders' : `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Orders`}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 text-center">
                  <Card.Body className="py-3">
                    <h4 className="text-success mb-1">
                      {orders.filter(o => o.order_status?.toUpperCase() === 'SUCCESS' || o.order_status?.toUpperCase() === 'COMPLETED' || o.order_status?.toUpperCase() === 'CONFIRMED').length}
                    </h4>
                    <small className="text-muted">Completed</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm rounded-4 text-center">
                  <Card.Body className="py-3">
                    <h4 className="text-warning mb-1">
                      {orders.filter(o => o.order_status?.toUpperCase() === 'PENDING').length}
                    </h4>
                    <small className="text-muted">Pending</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* No Filtered Results */}
            {filteredOrders.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center my-5"
              >
                <Card className="border-0 shadow-sm rounded-4 p-4">
                  <Card.Body>
                    <i className="bi bi-search display-4 text-muted mb-3"></i>
                    <h5 className="mb-3">No Orders Found</h5>
                    <p className="text-muted mb-3">
                      No orders match the selected filter: <strong>{statusFilter}</strong>
                    </p>
                    <Button 
                      variant="outline-primary" 
                      className="rounded-pill"
                      onClick={() => setStatusFilter('ALL')}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Show All Orders
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Orders Cards */}
            <Row className="g-4">
              {filteredOrders.map((order, idx) => (
                <Col key={order.order_id || idx} lg={6} xl={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
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
                      {/* Card Header */}
                      <Card.Header 
                        className="border-0 py-3"
                        style={{ 
                          background: order.order_status?.toUpperCase() === 'SUCCESS' || order.order_status?.toUpperCase() === 'COMPLETED' ? 
                            'linear-gradient(45deg, #28a745, #20c997)' : 
                            order.order_status?.toUpperCase() === 'PENDING' ?
                            'linear-gradient(45deg, #ffc107, #fd7e14)' :
                            'linear-gradient(45deg, #6c757d, #495057)'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {/* <h6 className="text-white mb-0 fw-bold">
                              <i className="bi bi-receipt me-2"></i>
                              Order #{order.order_id}
                            </h6> */}
                            <small className="text-white-50">
                              {formatDate(order.order_date)}
                            </small>
                          </div>
                          <Badge 
                            bg={getStatusColor(order.order_status)} 
                            className="px-3 py-2 rounded-pill"
                          >
                            <i className={`bi ${getStatusIcon(order.order_status)} me-1`}></i>
                            {order.order_status || 'Unknown'}
                          </Badge>
                        </div>
                      </Card.Header>

                      {/* Card Body */}
                      <Card.Body className="p-4">
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                              <i className="bi bi-calendar3 me-2"></i>
                              Order Date
                            </span>
                            <span className="fw-semibold">
                              {formatDate(order.order_date)}
                            </span>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">
                              <i className="bi bi-info-circle me-2"></i>
                              Status
                            </span>
                            <Badge bg={getStatusColor(order.order_status)} className="px-3 py-1">
                              <i className={`bi ${getStatusIcon(order.order_status)} me-1`}></i>
                              {order.order_status || 'Unknown'}
                            </Badge>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">
                              <i className="bi bi-currency-dollar me-2"></i>
                              Total Amount
                            </span>
                            <span className="fw-bold text-success fs-5">
                              ${order.total_amount?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </div>

                        {/* Simple Progress Bar */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Order Progress</small>
                            <small className="text-muted">
                              {order.order_status?.toUpperCase() === 'SUCCESS' || order.order_status?.toUpperCase() === 'COMPLETED' || order.order_status?.toUpperCase() === 'CONFIRMED' ? '100%' : 
                               order.order_status?.toUpperCase() === 'PENDING' ? '50%' : '0%'}
                            </small>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className={`progress-bar bg-${getStatusColor(order.order_status)}`}
                              style={{ 
                                width: order.order_status?.toUpperCase() === 'SUCCESS' || order.order_status?.toUpperCase() === 'COMPLETED' || order.order_status?.toUpperCase() === 'CONFIRMED' ? '100%' : 
                                       order.order_status?.toUpperCase() === 'PENDING' ? '50%' : '10%'
                              }}
                            />
                          </div>
                        </div>

                        {/* Status Description */}
                        <div className="mb-3">
                          <small className="text-muted">
                            {order.order_status?.toUpperCase() === 'SUCCESS' || order.order_status?.toUpperCase() === 'COMPLETED' ? 
                              'Your order has been completed successfully!' : 
                              order.order_status?.toUpperCase() === 'PENDING' ?
                              'Your order is being processed...' :
                              'Order status: ' + order.order_status}
                          </small>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 justify-content-center">
                          {/* View Details Button */}
                          <Button 
                            variant="outline-primary" 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                            title="View Details"
                            onClick={() => handleViewDetails(order.order_id)}
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          
                          {/* Payment button - only show for PENDING orders */}
                          {order.order_status?.toUpperCase() === 'PENDING' && (
                            <Button 
                              variant="success" 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '40px', height: '40px' }}
                              title="Pay Now"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePayment(order.order_id);
                              }}
                            >
                              <i className="bi bi-credit-card"></i>
                            </Button>
                          )}
                          
                          {/* Delete button - only show for PENDING orders */}
                          {order.order_status?.toUpperCase() === 'PENDING' && (
                            <Button 
                              variant="outline-danger" 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '40px', height: '40px' }}
                              title="Delete Order"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order);
                              }}
                              disabled={deletingOrderId === order.order_id}
                            >
                              {deletingOrderId === order.order_id ? (
                                <Spinner animation="border" size="sm" style={{ width: '16px', height: '16px' }} />
                              ) : (
                                <i className="bi bi-trash"></i>
                              )}
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-5"
        >
          <Button 
            variant="light" 
            size="lg" 
            className="rounded-pill px-5 shadow"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Home
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}

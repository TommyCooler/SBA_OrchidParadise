import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';
import OrderService from '../services/orderService';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Orders</h2>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : orders.length === 0 ? (
        <Alert variant="info">You have no orders yet.</Alert>
      ) : (
        <Table striped bordered hover responsive className="rounded-4 shadow">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{new Date(order.order_date || order.orderDate).toLocaleString()}</td>
                <td>{order.order_status || order.orderStatus}</td>
                <td>${order.total_amount?.toFixed(2) || order.totalAmount?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

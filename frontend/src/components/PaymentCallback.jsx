import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PaymentService from '../services/paymentService';

export default function PaymentCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    try {
      // Lấy query parameters từ URL
      const urlParams = new URLSearchParams(location.search);
      
      // Log tất cả parameters để debug
      console.log('=== MoMo Callback Parameters ===');
      console.log('Full URL:', window.location.href);
      console.log('Search params:', location.search);
      
      // Lấy các parameters từ MoMo callback
      const partnerCode = urlParams.get('partnerCode');
      const orderId = urlParams.get('orderId');
      const requestId = urlParams.get('requestId');
      const amount = urlParams.get('amount');
      const orderInfo = urlParams.get('orderInfo');
      const orderType = urlParams.get('orderType');
      const transId = urlParams.get('transId');
      const resultCode = urlParams.get('resultCode');
      const message = urlParams.get('message');
      const payType = urlParams.get('payType');
      const responseTime = urlParams.get('responseTime');
      const extraData = urlParams.get('extraData');
      const signature = urlParams.get('signature');

      // Log từng parameter
      console.log('Parameters received:');
      console.log('  partnerCode:', partnerCode);
      console.log('  orderId:', orderId);
      console.log('  requestId:', requestId);
      console.log('  amount:', amount);
      console.log('  orderInfo:', decodeURIComponent(orderInfo || ''));
      console.log('  orderType:', orderType);
      console.log('  transId:', transId);
      console.log('  resultCode:', resultCode);
      console.log('  message:', decodeURIComponent(message || ''));
      console.log('  payType:', payType);
      console.log('  responseTime:', responseTime);
      console.log('  extraData:', extraData);
      console.log('  signature:', signature);

      // Kiểm tra các parameters bắt buộc
      if (!orderId || !resultCode) {
        throw new Error('Missing required payment parameters (orderId or resultCode)');
      }

      // Xác định trạng thái thanh toán (resultCode = 0 nghĩa là thành công)
      const paymentStatus = resultCode === '0' ? 'success' : 'failed';
      
      // Tạo payload để gửi đến backend
      const payload = {
        orderId: orderId,
        status: paymentStatus,
        resultCode: resultCode,
        message: decodeURIComponent(message || 'Payment processed'),
        transId: transId,
        amount: amount,
        requestId: requestId,
        partnerCode: partnerCode,
        orderInfo: decodeURIComponent(orderInfo || ''),
        orderType: orderType,
        payType: payType,
        responseTime: responseTime,
        extraData: extraData,
        signature: signature
      };

      console.log('Processing payment callback with payload:', payload);

      // Gọi API để xử lý thanh toán
      const result = await PaymentService.handlePayment(payload);
      
      console.log('Payment processing result:', result);
      
      // Kiểm tra kết quả (resultCode = 0 nghĩa là thành công)
      if (result.result === 'success' || paymentStatus === 'success') {
        setSuccess(true);
        // Auto redirect sau 3 giây
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        throw new Error(result.message || 'Payment processing failed');
      }

    } catch (error) {
      console.error('Payment callback error:', error);
      setError(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
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
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Card.Body>
                <div className="mb-4">
                  <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
                <h4 className="mb-3">Processing Payment</h4>
                <p className="text-muted">
                  Please wait while we process your payment...
                </p>
              </Card.Body>
            </Card>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Card.Body>
              {success ? (
                <>
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success display-1"></i>
                  </div>
                  <h3 className="text-success mb-3">Payment Successful!</h3>
                  <p className="text-muted mb-4">
                    Your payment has been processed successfully. You will be redirected to your orders page in a few seconds.
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button 
                      variant="success" 
                      className="rounded-pill px-4"
                      onClick={() => navigate('/orders')}
                    >
                      <i className="bi bi-bag-check me-2"></i>
                      View Orders
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      className="rounded-pill px-4"
                      onClick={() => navigate('/')}
                    >
                      <i className="bi bi-house me-2"></i>
                      Home
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill text-danger display-1"></i>
                  </div>
                  <h3 className="text-danger mb-3">Payment Failed</h3>
                  <Alert variant="danger" className="text-start">
                    <Alert.Heading>Error Details:</Alert.Heading>
                    <p className="mb-0">{error}</p>
                  </Alert>
                  <div className="d-flex gap-2 justify-content-center mt-4">
                    <Button 
                      variant="primary" 
                      className="rounded-pill px-4"
                      onClick={() => navigate('/orders')}
                    >
                      <i className="bi bi-bag-check me-2"></i>
                      Back to Orders
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      className="rounded-pill px-4"
                      onClick={() => navigate('/')}
                    >
                      <i className="bi bi-house me-2"></i>
                      Home
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
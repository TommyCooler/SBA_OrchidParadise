import api from './api';

const PaymentService = {
  createPaymentUrl: async (orderId) => {
    try {
      const response = await api.post(`/payments/create-payment-url`, orderId);
      console.log('Payment URL response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment URL:', error);
      throw error;
    }
  },

  handlePayment: async (payload) => {
    try {
      const response = await api.post(`/payments/handle-payment`, payload);
      console.log('Handle payment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error handling payment:', error);
      throw error;
    }
  }
};

export default PaymentService;
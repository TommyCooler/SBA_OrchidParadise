import api from './api';

const OrderDetailService = {
  // Get all orders
  getOrderDetailByOrderID: async (order_id) => {
    try {
      const response = await api.get(`/order-details/order/${order_id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },
}

export default OrderDetailService;
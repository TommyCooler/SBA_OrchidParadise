import api from './api';

const OrchidService = {
  // Get all orchids
  getAllOrchids: async () => {
    try {
      const response = await api.get('/orchids');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchids');
    }
  },

  // Get orchid by ID
  getOrchidById: async (id) => {
    try {
      const response = await api.get(`/orchids/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchid');
    }
  },

  // Get orchid by name
  getOrchidByName: async (name) => {
    try {
      const response = await api.get(`/orchids/name/${name}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchid');
    }
  },

  // Create new orchid
  createOrchid: async (orchidRequest) => {
    try {
      // Validate and ensure correct data types before sending
      const requestBody = {
        orchidName: String(orchidRequest.orchidName).trim(),
        orchidDescription: String(orchidRequest.orchidDescription).trim(),
        orchidUrl: String(orchidRequest.orchidUrl).trim(),
        price: Number(orchidRequest.price),
        isNatural: Boolean(orchidRequest.isNatural),
        categoryId: Number(orchidRequest.categoryId)
      };
      
      // Additional validation
      if (requestBody.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      
      if (!requestBody.categoryId || requestBody.categoryId <= 0) {
        throw new Error('Valid category selection is required');
      }
      
      console.log('Sending orchid request to backend:', requestBody);
      
      const response = await api.post('/orchids/create', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        // Handle validation errors from backend
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.join(', ') || 
                           'Invalid orchid data. Please check all fields.';
        throw new Error(errorMessage);
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please login to continue.');
      }
      if (error.response?.status === 409) {
        throw new Error('Orchid name already exists. Please choose a different name.');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || error.message || 'Unable to create orchid');
    }
  },

  // Update orchid
  updateOrchid: async (id, orchidData) => {
    try {
      const response = await api.put(`/orchids/update/${id}`, orchidData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update orchid');
    }
  },

  // Delete orchid
  deleteOrchid: async (id) => {
    try {
      await api.delete(`/orchids/delete/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete orchid');
    }
  },

  // Get orchids by category
  getOrchidsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/orchids/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchids by category');
    }
  },

  // Get orchids by nature type (natural/artificial)
  getOrchidsByNatureType: async (isNatural) => {
    try {
      const response = await api.get(`/orchids/natural/${isNatural}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchids by nature type');
    }
  },

  // Get orchids by price range
  getOrchidsByPriceRange: async (minPrice, maxPrice) => {
    try {
      const response = await api.get('/orchids/price-range', {
        params: { minPrice, maxPrice }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchids by price range');
    }
  },

  // Search orchids by name
  searchOrchidsByName: async (name) => {
    try {
      const response = await api.get('/orchids/search/name', {
        params: { name }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search orchids by name');
    }
  },

  // Search orchids by description
  searchOrchidsByDescription: async (description) => {
    try {
      const response = await api.get('/orchids/search/description', {
        params: { description }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search orchids by description');
    }
  },

  // Get orchids sorted by price (ascending)
  getOrchidsOrderByPriceAsc: async () => {
    try {
      const response = await api.get('/orchids/sorted/price-asc');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchids sorted by price');
    }
  },

  // Get orchids sorted by price (descending)
  getOrchidsOrderByPriceDesc: async () => {
    try {
      const response = await api.get('/orchids/sorted/price-desc');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orchids sorted by price');
    }
  },

  // Check if orchid exists by name
  existsByName: async (name) => {
    try {
      const response = await api.get(`/orchids/exists/${name}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check orchid existence');
    }
  }
};

export default OrchidService;

import api from './api';

const CategoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data || []; // Return empty array if no data
    } catch (error) {
      // Handle different error cases
      if (error.response?.status === 404) {
        return []; // Return empty array for 404 (no data found)
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please login to continue.');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      // For network errors or other issues
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Unable to fetch categories');
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  },

  // Get category by name
  getCategoryByName: async (name) => {
    try {
      const response = await api.get(`/categories/name/${name}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      // Backend expects just the categoryName string as request body
      const categoryName = categoryData.categoryName;
      
      console.log('Creating category with name:', categoryName);
      const response = await api.post('/categories/create', categoryName, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please login to continue.');
      }
      if (error.response?.status === 409) {
        throw new Error('Category name already exists. Please choose a different name.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid category data.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Unable to create category');
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      // Ensure the data structure is correct for Java backend
      const requestBody = {
        categoryName: categoryData.categoryName
      };
      
      console.log('Updating category with data:', requestBody);
      const response = await api.put(`/categories/${id}`, requestBody);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please login to continue.');
      }
      if (error.response?.status === 404) {
        throw new Error('Category not found. It may have been deleted.');
      }
      if (error.response?.status === 409) {
        throw new Error('Category name already exists. Please choose a different name.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Unable to update category');
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please login to continue.');
      }
      if (error.response?.status === 404) {
        throw new Error('Category not found. It may have been already deleted.');
      }
      if (error.response?.status === 409) {
        throw new Error('Cannot delete category. It may be in use by other records.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Unable to delete category');
    }
  },

  // Search categories by name
  searchCategories: async (name) => {
    try {
      const response = await api.get('/categories/search', {
        params: { name }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search categories');
    }
  },

  // Check if category exists by name
  existsByName: async (name) => {
    try {
      const response = await api.get(`/categories/exists/${name}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check category existence');
    }
  }
};

export default CategoryService;

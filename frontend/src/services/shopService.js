const API_URL = 'https://barber-factory-api.onrender.com/api';

const shopService = {
  createShop: async (shopData, token) => {
    try {
      console.log('Creating shop with data:', shopData);
      const response = await fetch(`${API_URL}/shop/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create shop');
      }

      return data;
    } catch (error) {
      console.error('Create shop error:', error);
      throw error;
    }
  },

  getShopProfile: async (token) => {
    try {
      const response = await fetch(`${API_URL}/shop/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get shop profile');
      }

      return data;
    } catch (error) {
      console.error('Get shop profile error:', error);
      throw error;
    }
  },

  updateShopProfile: async (shopData, token) => {
    try {
      const response = await fetch(`${API_URL}/shop/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update shop');
      }

      return data;
    } catch (error) {
      console.error('Update shop error:', error);
      throw error;
    }
  }
};

export default shopService;
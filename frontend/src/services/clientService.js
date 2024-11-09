const API_URL = 'https://barber-factory-api.onrender.com/api';

const clientService = {
  // Get client profile
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_URL}/client/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update client profile
  updateProfile: async (profileData, token) => {
    try {
      const response = await fetch(`${API_URL}/client/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

export default clientService;
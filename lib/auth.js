// Auth utility functions
import { getApiUrl } from "./config";
const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api')
  : (process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://travel-go-backend.onrender.com/api' : '/api'));

export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await fetch(getApiUrl(`/auth/register`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(getApiUrl(`/auth/login`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  // Get user profile
  getProfile: async (token) => {
    const response = await fetch(getApiUrl(`/auth/profile`), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  // Update user profile
  updateProfile: async (token, userData) => {
    const response = await fetch(getApiUrl(`/auth/profile`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    return response.json();
  },

  // Add to wishlist
  addToWishlist: async (token, tourId) => {
    const response = await fetch(getApiUrl(`/auth/wishlist/${tourId}`), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to add to wishlist');
    }

    return response.json();
  },

  // Remove from wishlist
  removeFromWishlist: async (token, tourId) => {
    const response = await fetch(getApiUrl(`/auth/wishlist/${tourId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove from wishlist');
    }

    return response.json();
  },
};

// Token management
export const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },

  logout: () => {
    tokenManager.removeToken();
    tokenManager.removeUser();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};

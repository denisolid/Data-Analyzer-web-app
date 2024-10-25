import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Add admin bypass
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const mockResponse = {
        token: 'admin-mock-token',
        user: {
          id: 'admin',
          username: 'admin'
        }
      };
      localStorage.setItem('auth_token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      return mockResponse;
    }

    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw error;
  }
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    // Mock signup functionality
    const mockResponse = {
      token: `${credentials.username}-mock-token`,
      user: {
        id: Date.now().toString(),
        username: credentials.username
      }
    };
    localStorage.setItem('auth_token', mockResponse.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
    return mockResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const getCurrentUser = (): { id: string; username: string } | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getAuthHeader = () => ({
  Authorization: `Bearer ${getAuthToken()}`
});
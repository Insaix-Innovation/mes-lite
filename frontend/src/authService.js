import axios from 'axios';
import host from 'views/host.js';
const localhost = host.localhost;

const API_URL = `http://${localhost}:5000`;

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse( localStorage.getItem('user')) ;
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;

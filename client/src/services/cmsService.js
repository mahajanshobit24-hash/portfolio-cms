import axios from 'axios';

//const API_URL = '/api/cms';
const BASE_URL = process.env.REACT_APP_API_URL || '';
const API_URL = `${BASE_URL}/api/cms`;

// Get auth token
const getToken = () => localStorage.getItem('adminToken');

const headers = () => ({
  headers: {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  }
});

// ==================== CONTENT API ====================
export const getContent = async (section) => {
  const response = await axios.get(`${API_URL}/content/${section}`);
  return response.data;
};

export const getAllContent = async () => {
  const response = await axios.get(`${API_URL}/content`);
  return response.data;
};

export const updateContent = async (section, data) => {
  const response = await axios.put(`${API_URL}/content/${section}`, { data }, headers());
  return response.data;
};

export const resetContent = async (section) => {
  const response = await axios.delete(`${API_URL}/content/${section}`, headers());
  return response.data;
};

// ==================== PROJECTS API ====================
export const getProjects = async (params = {}) => {
  const response = await axios.get(`${API_URL}/projects`, { params });
  return response.data;
};

export const getProject = async (id) => {
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await axios.post(`${API_URL}/projects`, projectData, headers());
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await axios.put(`${API_URL}/projects/${id}`, projectData, headers());
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axios.delete(`${API_URL}/projects/${id}`, headers());
  return response.data;
};

export const toggleFeatured = async (id) => {
  const response = await axios.patch(`${API_URL}/projects/${id}/featured`, {}, headers());
  return response.data;
};

export const updateOrder = async (id, order) => {
  const response = await axios.patch(`${API_URL}/projects/${id}/order`, { order }, headers());
  return response.data;
};
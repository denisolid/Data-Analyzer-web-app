import axios from 'axios';
import { Connection } from '../types/connection';
import { getAuthHeader } from './auth';

const API_URL = 'http://localhost:5000/api';

export const createConnection = async (connection: Omit<Connection, 'id'>) => {
  const response = await axios.post(`${API_URL}/connections`, connection, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getConnections = async () => {
  const response = await axios.get(`${API_URL}/connections`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const testConnection = async (connection: Omit<Connection, 'id'>) => {
  const response = await axios.post(`${API_URL}/connections/test`, connection, {
    headers: getAuthHeader()
  });
  return response.data.success;
};

export const executeQuery = async (connectionId: string, query: string) => {
  const response = await axios.post(`${API_URL}/queries/execute`, {
    connectionId,
    query
  }, {
    headers: getAuthHeader()
  });
  return response.data;
};
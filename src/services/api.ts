import axios from 'axios';
import { Connection } from '../types/connection';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const testDatabaseConnection = async (connection: Connection): Promise<boolean> => {
  try {
    const response = await api.post('/database/test', connection);
    return response.data.success;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to test connection');
  }
};

export const saveConnection = async (connection: Connection): Promise<Connection> => {
  try {
    const response = await api.post('/database/connections', connection);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save connection');
  }
};

export const deleteConnection = async (id: string): Promise<void> => {
  try {
    await api.delete(`/database/connections/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete connection');
  }
};

export const executeQuery = async (connectionId: string, query: string): Promise<any> => {
  try {
    const response = await api.post('/database/query', { connectionId, query });
    return response.data.results;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to execute query');
  }
};
import { Connection, ConnectionTestResult, QueryExecutionResult } from '../types/connection';
import axios from 'axios';

export async function testConnection(connection: Connection): Promise<ConnectionTestResult> {
  try {
    const response = await axios.post('/api/database/test', connection);
    return {
      success: true,
      message: response.data.message || 'Connection successful'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || 'Connection failed',
        error: error.response?.data?.error
      };
    }
    return {
      success: false,
      message: 'Connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function executeQuery(connection: Connection, query: string): Promise<QueryExecutionResult> {
  try {
    const response = await axios.post('/api/database/query', {
      connectionId: connection.id,
      query
    });
    
    return {
      success: true,
      columns: response.data.columns,
      rows: response.data.rows
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to execute query'
    };
  }
}

export async function getDatabaseSchema(connection: Connection) {
  try {
    const response = await axios.get(`/api/database/schema/${connection.id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch database schema');
  }
}
import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import { Connection } from '../types/connection';

export interface QueryResult {
  columns: string[];
  rows: any[];
  error?: string;
}

export async function testDatabaseConnection(connection: Connection): Promise<boolean> {
  try {
    if (connection.type === 'mysql') {
      const conn = await mysql.createConnection({
        host: connection.host,
        port: parseInt(connection.port),
        user: connection.username,
        database: connection.database
      });
      await conn.end();
    } else if (connection.type === 'mongodb') {
      const uri = `mongodb://${connection.username}@${connection.host}:${connection.port}/${connection.database}`;
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

export async function executeQuery(connection: Connection, query: string): Promise<QueryResult> {
  try {
    if (connection.type === 'mysql') {
      const conn = await mysql.createConnection({
        host: connection.host,
        port: parseInt(connection.port),
        user: connection.username,
        database: connection.database
      });

      const [rows] = await conn.execute(query);
      await conn.end();

      if (Array.isArray(rows)) {
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        return { columns, rows };
      }
      return { columns: [], rows: [] };
    } else if (connection.type === 'mongodb') {
      const uri = `mongodb://${connection.username}@${connection.host}:${connection.port}/${connection.database}`;
      const client = new MongoClient(uri);
      await client.connect();

      const db = client.db(connection.database);
      const collection = db.collection(query); // In MongoDB case, query is collection name
      const rows = await collection.find({}).limit(1000).toArray();
      await client.close();

      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return { columns, rows };
    }

    throw new Error('Unsupported database type');
  } catch (error) {
    return {
      columns: [],
      rows: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
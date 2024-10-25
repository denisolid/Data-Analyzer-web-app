import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import { decryptConnectionDetails } from './connectionManager.js';

const validateQuery = (query) => {
  // Add query validation/sanitization logic
  const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'GRANT'];
  return !dangerousKeywords.some(keyword => 
    query.toUpperCase().includes(keyword)
  );
};

export const executeQuery = async (connection, query) => {
  try {
    if (!validateQuery(query)) {
      throw new Error('Query contains forbidden operations');
    }

    const decrypted = await decryptConnectionDetails(connection);

    if (decrypted.type === 'mysql') {
      const conn = await mysql.createConnection({
        host: decrypted.host,
        port: parseInt(decrypted.port),
        user: decrypted.username,
        database: decrypted.database
      });

      const [rows] = await conn.execute(query);
      await conn.end();

      return {
        columns: rows.length > 0 ? Object.keys(rows[0]) : [],
        rows
      };
    } else if (decrypted.type === 'mongodb') {
      const uri = `mongodb://${decrypted.username}@${decrypted.host}:${decrypted.port}/${decrypted.database}`;
      const client = new MongoClient(uri);
      await client.connect();

      const db = client.db(decrypted.database);
      const collection = db.collection(query); // In MongoDB case, query is collection name
      const rows = await collection.find({}).limit(1000).toArray();
      await client.close();

      return {
        columns: rows.length > 0 ? Object.keys(rows[0]) : [],
        rows
      };
    }

    throw new Error('Unsupported database type');
  } catch (error) {
    throw new Error(`Query execution failed: ${error.message}`);
  }
};
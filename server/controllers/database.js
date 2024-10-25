import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import { decrypt } from '../utils/encryption.js';

export const testConnection = async (req, res) => {
  const connection = req.body;
  
  try {
    if (connection.type === 'mongodb') {
      let uri;
      if (connection.options?.useConnectionString) {
        // Use the full connection string directly
        uri = connection.host;
      } else {
        // Construct connection string from parts
        const credentials = connection.username && connection.password 
          ? `${encodeURIComponent(connection.username)}:${encodeURIComponent(connection.password)}@`
          : '';
        uri = `mongodb://${credentials}${connection.host}:${connection.port}/${connection.database}`;
      }

      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        ssl: connection.options?.ssl
      });
      
      await client.connect();
      await client.db().admin().ping();
      await client.close();
      
      res.json({ 
        success: true, 
        message: 'Successfully connected to MongoDB database'
      });
    } else if (connection.type === 'mysql') {
      const conn = await mysql.createConnection({
        host: connection.host,
        port: parseInt(connection.port),
        user: connection.username,
        password: connection.password,
        database: connection.database,
        connectTimeout: 5000,
        ssl: connection.options?.ssl ? {} : undefined
      });
      await conn.ping();
      await conn.end();
      res.json({ 
        success: true, 
        message: 'Successfully connected to MySQL database' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Unsupported database type' 
      });
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
    let errorMessage = 'Connection failed';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused. Please check if the database server is running and accessible.';
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Access denied. Please check your username and password.';
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Database does not exist.';
    } else if (error.message.includes('Authentication failed')) {
      errorMessage = 'Authentication failed. Please check your credentials.';
    } else if (error.message.includes('bad auth')) {
      errorMessage = 'Authentication failed. Please check your MongoDB credentials and ensure your IP is whitelisted.';
    } else if (error.message.includes('Invalid connection string')) {
      errorMessage = 'Invalid MongoDB connection string. Please check your cluster URL.';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Host not found. Please check your connection string or host address.';
    }
    
    res.status(400).json({ 
      success: false, 
      message: errorMessage
    });
  }
};

export const executeQuery = async (req, res) => {
  const { connectionId, query } = req.body;
  
  try {
    // Get connection details from database and decrypt
    const connection = await getStoredConnection(connectionId);
    
    if (!connection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Connection not found' 
      });
    }

    if (connection.type === 'mongodb') {
      let uri;
      if (connection.options?.useConnectionString) {
        uri = connection.host;
      } else {
        const credentials = connection.username && connection.password 
          ? `${encodeURIComponent(connection.username)}:${encodeURIComponent(decrypt(connection.password))}@`
          : '';
        uri = `mongodb://${credentials}${connection.host}:${connection.port}/${connection.database}`;
      }

      const client = new MongoClient(uri, {
        ssl: connection.options?.ssl
      });
      
      try {
        await client.connect();
        const db = client.db(connection.database);
        const results = await db.collection(query).find({}).limit(1000).toArray();
        res.json({
          success: true,
          columns: results.length > 0 ? Object.keys(results[0]) : [],
          rows: results
        });
      } finally {
        await client.close();
      }
    } else if (connection.type === 'mysql') {
      const conn = await mysql.createConnection({
        host: connection.host,
        port: parseInt(connection.port),
        user: connection.username,
        password: decrypt(connection.password),
        database: connection.database,
        ssl: connection.options?.ssl ? {} : undefined
      });

      try {
        const [results] = await conn.execute(query);
        res.json({
          success: true,
          columns: results.length > 0 ? Object.keys(results[0]) : [],
          rows: results
        });
      } finally {
        await conn.end();
      }
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Unsupported database type' 
      });
    }
  } catch (error) {
    console.error('Query execution failed:', error);
    res.status(400).json({ 
      success: false, 
      message: `Query execution failed: ${error.message}` 
    });
  }
};
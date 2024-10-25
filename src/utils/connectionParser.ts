import { Connection } from '../types/connection';

export function parseMongoDBConnectionString(connectionString: string): Partial<Connection> {
  try {
    const url = new URL(connectionString);
    
    // Extract username and password from auth
    const [username, password] = (url.username && url.password) 
      ? [decodeURIComponent(url.username), decodeURIComponent(url.password)]
      : ['', ''];

    // Extract host and port
    const host = url.hostname;
    const port = url.port || '27017';

    // Extract database name from pathname (remove leading slash)
    const database = url.pathname.substring(1);

    // Extract additional options from search params
    const options: Record<string, any> = {};
    url.searchParams.forEach((value, key) => {
      if (key === 'ssl') {
        options.ssl = value === 'true';
      } else if (key === 'replicaSet') {
        options.replicaSet = value;
      } else if (key === 'authSource') {
        options.authSource = value;
      }
    });

    // For MongoDB Atlas URLs
    const isAtlas = url.protocol === 'mongodb+srv:';
    if (isAtlas) {
      options.useConnectionString = true;
      options.ssl = true;
    }

    return {
      type: 'mongodb',
      host: isAtlas ? connectionString : host,
      port,
      database,
      username,
      password,
      options
    };
  } catch (error) {
    throw new Error('Invalid MongoDB connection string format');
  }
}
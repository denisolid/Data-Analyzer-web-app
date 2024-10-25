export const CONNECTION_ERRORS = {
  INVALID_CONNECTION_STRING: 'Invalid connection string format',
  CONNECTION_REFUSED: 'Connection refused. Please check if the database server is running and accessible.',
  AUTH_FAILED: 'Authentication failed. Please check your credentials.',
  TIMEOUT: 'Connection timed out. Please verify the host and port are correct.',
  HOST_NOT_FOUND: 'Host not found. Please check your connection string or host address.',
  ACCESS_DENIED: 'Access denied. Please check your username and password.',
  DATABASE_NOT_FOUND: 'Database not found. Please check the database name.',
  SSL_REQUIRED: 'SSL connection is required. Please enable SSL/TLS.',
  INVALID_PORT: 'Invalid port number. Port must be between 1 and 65535.',
  INVALID_HOST: 'Invalid hostname format.',
  MISSING_REQUIRED_FIELDS: 'Please fill in all required fields.',
  GENERIC_ERROR: 'An error occurred while connecting to the database.'
};

export function getConnectionError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  const errorMessage = error?.message?.toLowerCase() || '';

  if (errorMessage.includes('econnrefused')) {
    return CONNECTION_ERRORS.CONNECTION_REFUSED;
  }

  if (errorMessage.includes('auth failed') || errorMessage.includes('authentication failed')) {
    return CONNECTION_ERRORS.AUTH_FAILED;
  }

  if (errorMessage.includes('etimedout')) {
    return CONNECTION_ERRORS.TIMEOUT;
  }

  if (errorMessage.includes('enotfound')) {
    return CONNECTION_ERRORS.HOST_NOT_FOUND;
  }

  if (errorMessage.includes('access denied')) {
    return CONNECTION_ERRORS.ACCESS_DENIED;
  }

  if (errorMessage.includes('database') && errorMessage.includes('not found')) {
    return CONNECTION_ERRORS.DATABASE_NOT_FOUND;
  }

  if (errorMessage.includes('ssl') || errorMessage.includes('tls')) {
    return CONNECTION_ERRORS.SSL_REQUIRED;
  }

  if (errorMessage.includes('port')) {
    return CONNECTION_ERRORS.INVALID_PORT;
  }

  if (errorMessage.includes('hostname') || errorMessage.includes('host')) {
    return CONNECTION_ERRORS.INVALID_HOST;
  }

  if (errorMessage.includes('required')) {
    return CONNECTION_ERRORS.MISSING_REQUIRED_FIELDS;
  }

  return CONNECTION_ERRORS.GENERIC_ERROR;
}
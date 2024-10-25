export function validateMongoDBConnectionString(connectionString: string): boolean {
  try {
    const url = new URL(connectionString);
    
    // Check protocol
    if (!url.protocol.match(/^mongodb(\+srv)?:$/)) {
      return false;
    }

    // Check required components
    if (!url.hostname || !url.pathname.substring(1)) {
      return false;
    }

    // For MongoDB Atlas (mongodb+srv://), port should not be specified
    if (url.protocol === 'mongodb+srv:' && url.port) {
      return false;
    }

    // Validate auth if present
    if (url.username && !url.password) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function validateMySQLConnection(host: string, port: string, database: string): boolean {
  if (!host || !database) {
    return false;
  }

  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    return false;
  }

  // Check for valid hostname format
  const hostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
  if (host !== 'localhost' && !hostnameRegex.test(host) && !isValidIP(host)) {
    return false;
  }

  return true;
}

function isValidIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}
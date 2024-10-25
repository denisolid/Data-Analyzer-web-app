type DatabaseType = 'mysql' | 'mongodb' | 'postgresql';

export function getDefaultPort(type: DatabaseType): string {
  switch (type) {
    case 'mysql':
      return '3306';
    case 'mongodb':
      return '27017';
    case 'postgresql':
      return '5432';
    default:
      return '';
  }
}

export function getConnectionHelp(type: DatabaseType): string {
  switch (type) {
    case 'mongodb':
      return `MongoDB connection string format:
mongodb://username:password@host:port/database

For MongoDB Atlas:
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database

Options can be added as URL parameters:
mongodb://username:password@host:port/database?ssl=true`;

    case 'mysql':
      return `Ensure the MySQL server is configured to accept remote connections:
1. Edit my.cnf:
[mysqld]
bind-address = 0.0.0.0

2. Grant privileges:
GRANT ALL PRIVILEGES ON database.* TO 'username'@'%';
FLUSH PRIVILEGES;`;

    case 'postgresql':
      return `Ensure PostgreSQL is configured for remote connections:
1. Edit postgresql.conf:
listen_addresses = '*'

2. Edit pg_hba.conf:
host    all    all    0.0.0.0/0    md5`;

    default:
      return '';
  }
}
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;

export const encryptConnectionDetails = async (connection) => {
  const iv = crypto.randomBytes(ivLength);
  const salt = crypto.randomBytes(saltLength);

  const key = crypto.pbkdf2Sync(
    process.env.ENCRYPTION_KEY,
    salt,
    100000,
    32,
    'sha256'
  );

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(connection)),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    tag: tag.toString('hex')
  };
};

export const decryptConnectionDetails = async (encryptedData) => {
  const { encrypted, iv, salt, tag } = encryptedData;

  const key = crypto.pbkdf2Sync(
    process.env.ENCRYPTION_KEY,
    Buffer.from(salt, 'hex'),
    100000,
    32,
    'sha256'
  );

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString());
};

export const testConnection = async (connection) => {
  try {
    const decrypted = await decryptConnectionDetails(connection);

    if (decrypted.type === 'mysql') {
      const conn = await mysql.createConnection({
        host: decrypted.host,
        port: parseInt(decrypted.port),
        user: decrypted.username,
        database: decrypted.database
      });
      await conn.end();
    } else if (decrypted.type === 'mongodb') {
      const uri = `mongodb://${decrypted.username}@${decrypted.host}:${decrypted.port}/${decrypted.database}`;
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
    }
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};
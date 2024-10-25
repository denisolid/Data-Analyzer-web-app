import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;

export const encrypt = (text) => {
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
    cipher.update(text, 'utf8'),
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

export const decrypt = (encryptedData) => {
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

  return decrypted.toString('utf8');
};
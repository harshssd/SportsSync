

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { env } from '@/lib/env';

// FIX: Define Buffer from globalThis to make it available in Node.js runtime without @types/node.
const Buffer = (globalThis as any).Buffer;

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY = Buffer.from(env.TOKEN_ENC_KEY, 'base64');

interface EncryptedData {
  iv: string;
  ciphertext: string;
  tag: string;
}

/**
 * Encrypts a string using AES-256-GCM.
 * @param text The string to encrypt.
 * @returns An object containing the iv, ciphertext, and authentication tag, all base64 encoded.
 */
export const encrypt = (text: string): EncryptedData => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    tag: tag.toString('base64'),
  };
};

/**
 * Decrypts data encrypted with the `encrypt` function.
 * @param data An object containing the base64 encoded iv, ciphertext, and authentication tag.
 * @returns The original decrypted string.
 */
export const decrypt = (data: EncryptedData): string => {
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(data.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(data.tag, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data.ciphertext, 'base64')), decipher.final()]);
  return decrypted.toString('utf8');
};

/**
 * Serializes encrypted data into a single string for storage.
 * Format: enc::<iv>::<ciphertext>::<tag>
 */
export const serializeEncryptedData = (data: EncryptedData): string => {
  return `enc::${data.iv}::${data.ciphertext}::${data.tag}`;
};

/**
 * Deserializes a string back into an EncryptedData object.
 * @param serialized The string to deserialize.
 * @returns An EncryptedData object or null if format is invalid.
 */
export const deserializeEncryptedData = (serialized: string): EncryptedData | null => {
  if (!serialized.startsWith('enc::')) {
    return null;
  }
  const parts = serialized.split('::');
  if (parts.length !== 4) {
    return null;
  }
  const [, iv, ciphertext, tag] = parts;
  return { iv, ciphertext, tag };
};
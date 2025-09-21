import { describe, it, expect, vi } from 'vitest';
import { encrypt, decrypt, serializeEncryptedData, deserializeEncryptedData } from '../../lib/crypto';

// Mock the environment variables used by the crypto module
vi.mock('@/lib/env', () => ({
  env: {
    TOKEN_ENC_KEY: 'iZ/3Cy+l48L5k1DU8vH5E7I9E7Z/3y+l48L5k1DU8vE=', // A valid 32-byte base64 key
  },
}));

describe('Crypto Utility', () => {
  const originalText = 'This is a secret message!';

  it('should encrypt and decrypt text successfully (round-trip)', () => {
    const encryptedData = encrypt(originalText);
    const decryptedText = decrypt(encryptedData);
    expect(decryptedText).toBe(originalText);
  });

  it('should serialize and deserialize encrypted data correctly', () => {
    const encryptedData = encrypt(originalText);
    const serialized = serializeEncryptedData(encryptedData);
    
    expect(serialized).toMatch(/^enc::/);
    
    const deserialized = deserializeEncryptedData(serialized);
    
    expect(deserialized).toEqual(encryptedData);
  });

  it('should return null when deserializing an invalid string format', () => {
    const invalidString1 = 'invalid-string';
    const invalidString2 = 'enc::iv::ciphertext'; // Not enough parts
    
    expect(deserializeEncryptedData(invalidString1)).toBeNull();
    expect(deserializeEncryptedData(invalidString2)).toBeNull();
  });

  it('should throw an error if decryption fails (e.g., tampered data)', () => {
    const encryptedData = encrypt(originalText);
    
    // Tamper with the ciphertext
    const tamperedData = {
      ...encryptedData,
      ciphertext: 'tampered' + encryptedData.ciphertext.slice(8),
    };
    
    expect(() => decrypt(tamperedData)).toThrow();
  });

  it('should produce different IVs and ciphertexts for the same plaintext', () => {
    const encrypted1 = encrypt(originalText);
    const encrypted2 = encrypt(originalText);
    
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
  });
});

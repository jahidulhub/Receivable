import CryptoJS from 'crypto-js';

const HASH_SECRET = 'receivable-backup-secret-2026';

export const generateHash = (data: object): string => {
  const jsonString = JSON.stringify(data);
  const hash = CryptoJS.SHA256(jsonString + HASH_SECRET).toString();
  return hash.substring(0, 16).toUpperCase().replace(/(.{4})/g, '$1-').slice(0, -1);
};

export const verifyHash = (data: object, hash: string): boolean => {
  const calculatedHash = generateHash(data);
  return calculatedHash === hash;
};

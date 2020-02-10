import aesJs from 'aes-js';
import { arrayify, isHexString } from '@ethersproject/bytes';
import {
  sha256,
  sha512,
  computeHmac,
  SupportedAlgorithm,
} from '@ethersproject/sha2';

const pkcs7 = require('pkcs7');

export async function fallbackCreateHmac(
  key: Buffer,
  data: Buffer
): Promise<Buffer> {
  const result = computeHmac(SupportedAlgorithm.sha256, key, data);
  return Buffer.from(result);
}

export async function fallbackAesEncrypt(
  iv: Buffer,
  key: Buffer,
  data: Buffer
): Promise<Buffer> {
  const aesCbc = new aesJs.ModeOfOperation.cbc(key, iv);
  const encryptedBytes = aesCbc.encrypt(pkcs7.pad(data));
  return Buffer.from(encryptedBytes);
}

export async function fallbackAesDecrypt(
  iv: Buffer,
  key: Buffer,
  data: Buffer
): Promise<Buffer> {
  const aesCbc = new aesJs.ModeOfOperation.cbc(key, iv);
  const encryptedBytes = aesCbc.decrypt(data);
  const result: Buffer = pkcs7.unpad(Buffer.from(encryptedBytes));
  return result;
}

export async function fallbackSha256(msg: Buffer | string): Promise<Buffer> {
  const enc = isHexString(msg) ? 'hex' : undefined;
  const buf = typeof msg === 'string' ? Buffer.from(msg, enc) : msg;
  const hash = sha256(buf);
  return Buffer.from(arrayify(hash));
}

export async function fallbackSha512(msg: Buffer | string): Promise<Buffer> {
  const enc = isHexString(msg) ? 'hex' : undefined;
  const buf = typeof msg === 'string' ? Buffer.from(msg, enc) : msg;
  const hash = sha512(buf);
  return Buffer.from(arrayify(hash));
}

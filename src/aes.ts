import { isBrowser, browserAesEncrypt, browserAesDecrypt } from './lib/browser';
import { isNode, nodeAesEncrypt, nodeAesDecrypt } from './lib/node';
import { fallbackAesEncrypt, fallbackAesDecrypt } from './lib/fallback';

import { ENCRYPT_OP, DECRYPT_OP, EMPTY_BUFFER } from './helpers/constants';

export function getAes(op: string) {
  return async (iv: Buffer, key: Buffer, data: Buffer) => {
    if (isBrowser()) {
      if (op === ENCRYPT_OP) {
        const result = await browserAesEncrypt(data, key, iv);
        return result;
      } else if (op === DECRYPT_OP) {
        const result = await browserAesDecrypt(data, key, iv);
        return result;
      }
    } else if (isNode()) {
      if (op === ENCRYPT_OP) {
        const result = await nodeAesEncrypt(iv, key, data);
        return result;
      } else if (op === DECRYPT_OP) {
        const result = await nodeAesDecrypt(iv, key, data);
        return result;
      }
    } else {
      if (op === ENCRYPT_OP) {
        const result = await fallbackAesEncrypt(iv, key, data);
        return result;
      } else if (op === DECRYPT_OP) {
        const result = await fallbackAesDecrypt(iv, key, data);
        return result;
      }
    }
    return EMPTY_BUFFER;
  };
}

export const aesCbcEncrypt = getAes(ENCRYPT_OP);
export const aesCbcDecrypt = getAes(DECRYPT_OP);

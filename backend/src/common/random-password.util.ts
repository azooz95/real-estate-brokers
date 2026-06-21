import { randomInt } from 'crypto';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';

export function generatePassword(length = 12): string {
  let out = '';
  for (let i = 0; i < length; i++) out += CHARS[randomInt(CHARS.length)];
  return out;
}

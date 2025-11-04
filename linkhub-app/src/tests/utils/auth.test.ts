import { describe, it, expect } from 'vitest';
import { validateToken } from '../../utils/auth';

describe('validateToken', () => {
  it('should return false if token is null', () => {
    expect(validateToken(null)).toBe(false);
  });

  it('should return false if token is "token-expirado"', () => {
    expect(validateToken('token-expirado')).toBe(false);
  });

  it('should return true for any other token', () => {
    expect(validateToken('token-valido')).toBe(true);
    expect(validateToken('12345')).toBe(true);
    expect(validateToken('otro-token')).toBe(true);
  });
});
import { describe, it, expect, vi } from 'vitest';
import { getApiUrl } from '../config';

describe('getApiUrl', () => {
  it('uses the environment variable if defined', () => {
    vi.stubEnv('VITE_API_URL', 'http://fake-api');
    expect(getApiUrl()).toBe('http://fake-api');
  });

  it('falls back to default if environment variable is undefined', () => {
    vi.stubEnv('VITE_API_URL', '');
    expect(getApiUrl()).toBe('http://192.168.1.40:3000');
  });
});

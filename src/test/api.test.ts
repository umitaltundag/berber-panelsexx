import { describe, it, expect } from 'vitest';

const BASE = 'http://localhost:3000';

describe('Public API', () => {
  it('should fetch services', async () => {
    const res = await fetch(`${BASE}/api/public/services`);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should fetch staff', async () => {
    const res = await fetch(`${BASE}/api/public/staff`);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should validate valid coupon', async () => {
    const res = await fetch(`${BASE}/api/public/coupons?code=YAZ15`);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.code).toBe('YAZ15');
  });

  it('should reject invalid coupon', async () => {
    const res = await fetch(`${BASE}/api/public/coupons?code=INVALID`);
    const data = await res.json();
    expect(data.success).toBe(false);
  });
});

describe('Auth API', () => {
  it('should reject login without credentials', async () => {
    const res = await fetch(`${BASE}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    expect(data.success).toBe(false);
  });
});

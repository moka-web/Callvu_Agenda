import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('Express App Smoke Test', () => {
  it('should respond with 200 OK on health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

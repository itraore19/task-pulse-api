const request = require('supertest');
const app = require('../src/app');

describe('Quality & Observability Endpoints', () => {
  
  // 1. Test the Root Endpoint
  test('GET / should return active status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Task Pulse API Active');
  });

  // 2. Test the Health Check (Critical for Kubernetes)
  test('GET /health should return UP status for K8s probes', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  // 3. Test the Prometheus Metrics Endpoint
  test('GET /metrics should return Prometheus formatted data', async () => {
    const res = await request(app).get('/metrics');
    
    expect(res.statusCode).toBe(200);
    // Prometheus metrics must be returned as plain text
    expect(res.header['content-type']).toMatch(/text\/plain/);
    
    // Verify that our custom metric 'http_request_duration_seconds' is present
    expect(res.text).toContain('http_request_duration_seconds_bucket');
    expect(res.text).toContain('nodejs_version_info');
  });

  // 4. Test Error Handling (Quality Gate for 404s)
  test('GET /unknown-route should return 404', async () => {
    const res = await request(app).get('/some-random-route');
    expect(res.statusCode).toBe(404);
  });
});

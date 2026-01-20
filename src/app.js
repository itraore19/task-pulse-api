const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();

// 1. Add default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics({ register });

// 2. Define a custom metric for Quality Monitoring
const httpRequestTimer = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});
register.registerMetric(httpRequestTimer);

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestTimer.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Routes
app.get('/', (req, res) => res.send({ status: 'Task Pulse API Active' }));
app.get('/health', (req, res) => res.status(200).send({ status: 'UP' }));
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

module.exports = app;


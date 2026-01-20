const app = require('./app');

// Quality Engineering Tip: Use environment variables for configuration
// to ensure the app is portable across different K8s environments.
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 Task Pulse API running on port ${PORT}`);
  console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(`-----------------------------------------`);
});

// Graceful Shutdown: Essential for Kubernetes lifecycle management.
// When K8s stops a pod, it sends a SIGTERM.
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

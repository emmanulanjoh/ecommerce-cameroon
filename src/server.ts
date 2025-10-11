// Lazy module loading for better performance
const loadApp = async () => {
  const { default: app } = await import('./app');
  return app;
};

const loadMongoose = async () => {
  const { default: mongoose } = await import('mongoose');
  return mongoose;
};

// Start server with lazy loading
const startServer = async () => {
  const app = await loadApp();
  const PORT = parseInt(process.env.PORT || '5000');
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  return server;
};

let server: any;
startServer()
  .then(s => {
    server = s;
    console.log('Server started successfully');
  })
  .catch(err => {
    const sanitizedError = typeof err === 'object' && err.message ? err.message.replace(/[\r\n\t]/g, ' ').substring(0, 200) : 'Unknown error';
    console.error('Failed to start server:', sanitizedError);
    process.exit(1);
  });

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Cache mongoose for shutdown
let mongooseInstance: any;
loadMongoose().then(m => mongooseInstance = m);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log('HTTP server closed');
        resolve();
      });
    });
    
    if (mongooseInstance) {
      mongooseInstance.connection.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  }
});
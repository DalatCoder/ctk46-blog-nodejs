const app = require('./app');
const prisma = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Graceful shutdown function
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Starting graceful shutdown...');
  
  try {
    // Close Prisma connection
    await prisma.$disconnect();
    console.log('Database connection closed.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Database connection and server start
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection established successfully.');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
      console.log(`🌐 Frontend: http://localhost:${PORT}`);
      console.log(`🔐 Login: http://localhost:${PORT}/auth/login`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🗄️  Prisma Studio: Run 'npm run db:studio' to open database browser`);
      }
    });

    // Handle server shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      gracefulShutdown();
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown();
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

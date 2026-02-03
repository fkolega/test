import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connect_to_mongodb, get_database } from './database/connection.js';

// Create Hono app
const app = new Hono();

// Configure CORS to accept requests from any host
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['*'],
  exposeHeaders: ['*'],
  credentials: true
}));

// Basic route
app.get('/', (c) => {
  return c.json({ message: 'Hono server with MongoDB' });
});

// Health check endpoint
app.get('/api/health', async (c) => {
  try {
    const db = get_database();
    // Ping MongoDB to check connection
    await db.admin().ping();
    
    return c.json({
      status: 'healthy',
      message: 'Backend is running and connected to MongoDB',
      timestamp: new Date().toISOString(),
      mongodb: 'connected'
    });
  } catch (error) {
    // Log detailed error for debugging without exposing it in response
    console.error('Health check failed:', {
      timestamp: new Date().toISOString(),
      error_type: error instanceof Error ? error.constructor.name : 'Unknown'
    });
    
    return c.json({
      status: 'unhealthy',
      message: 'Backend is running but MongoDB connection failed',
      timestamp: new Date().toISOString(),
      mongodb: 'disconnected'
    }, 503);
  }
});

// Start server
const port = parseInt(process.env.PORT || '9002', 10);

connect_to_mongodb()
  .then(() => {
    console.log('✅ Connected to MongoDB');
    serve({
      fetch: app.fetch,
      port
    });
    console.log(`🚀 Server running on http://localhost:${port}`);
  })
  .catch((error: unknown) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
  
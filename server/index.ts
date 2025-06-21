import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { connectToDatabase } from "./db.js";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database connection
if (process.env.MONGODB_URI) {
  connectToDatabase().then(() => {
    console.log('MongoDB connection established');
  }).catch((error) => {
    console.error('MongoDB connection failed:', error);
  });
} else {
  console.log('Using in-memory storage');
}

// API status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Music Explorer API Running',
    version: '1.0.0',
    endpoints: {
      charts: '/api/charts/top-tracks',
      playlists: '/api/playlists',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Register API routes
const server = await registerRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  throw err;
});

// Start server
const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`);
});
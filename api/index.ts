// Vercel serverless function entry point
import express from 'express';
import { registerRoutes } from '../server/routes.js';
import { serveStatic } from '../server/vite.js';
import { initializeData } from '../server/init-data.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize the app
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return;
  
  const server = await registerRoutes(app);
  
  // Initialize sample data
  await initializeData();

  // Error handling middleware
  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Serve static files in production
  serveStatic(app);

  isInitialized = true;
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  await initializeApp();
  
  // Handle the request
  return new Promise((resolve, reject) => {
    app(req, res, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
} 
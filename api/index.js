// Vercel serverless function entry point
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple static file serving for production
function serveStatic(app) {
  const distPath = path.resolve(__dirname, '..', 'dist', 'public');

  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}`);
    return;
  }

  console.log('Serving static files from:', distPath);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Initialize the app
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return;
  
  try {
    // For now, just serve static files
    // We can add database and routes later
    serveStatic(app);
    
    isInitialized = true;
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
    throw error;
  }
}

// Vercel serverless function handler
module.exports = async function handler(req, res) {
  try {
    await initializeApp();
    
    // Handle the request
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          console.error('Express error:', err);
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}; 
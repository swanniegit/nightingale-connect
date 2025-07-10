import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { initializeData } from "./init-data";
import path from "path";
import jwt from 'jsonwebtoken';

const app = express();

// Static file serving will be handled by serveStatic() in production
// and setupVite() in development
   
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: any, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      req.user = { claims: decoded };
    } catch (err) {
      // Invalid token, leave req.user undefined
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Initialize the app
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return;
  
  const server = await registerRoutes(app);
  
  // Initialize sample data
  await initializeData();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Dynamically import vite setup only in development
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    // Dynamically import static serving only in production
    const { serveStatic } = await import("./vite");
    serveStatic(app);
  }

  isInitialized = true;
}

// For traditional deployment (Railway, etc.)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  (async () => {
    await initializeApp();
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`serving on port ${port}`);
    });
  })();
}

// For Vercel deployment
export default async function handler(req: Request, res: Response) {
  await initializeApp();
  return app(req, res);
}

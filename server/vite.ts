import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Dynamically import viteConfig only in development
  let viteConfig = {};
  if (process.env.NODE_ENV === "development") {
    viteConfig = (await import("../vite.config")).default;
  }

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  console.log("=== Static File Resolution Debug ===");
  console.log(`__dirname: ${__dirname}`);
  console.log(`process.cwd(): ${process.cwd()}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`VERCEL: ${process.env.VERCEL}`);
  
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === "1";
  
  // In Vercel production, static files are handled by Vercel's static build
  // We only need to serve static files in development or when not using Vercel
  if (isVercel && process.env.NODE_ENV === "production") {
    console.log("=== Vercel production detected - skipping static file serving ===");
    console.log("Static files are handled by Vercel's static build");
    
    // In Vercel, serve a simple HTML response for any non-API routes
    app.use("*", (req, res) => {
      // Only handle non-API routes
      if (!req.path.startsWith('/api/')) {
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Nightingale Connect</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
              <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                <div style="text-align: center;">
                  <h1>Nightingale Connect</h1>
                  <p>Loading...</p>
                  <p style="color: #666; font-size: 14px;">Redirecting to static files...</p>
                </div>
              </div>
            </body>
          </html>
        `);
      } else {
        res.status(404).json({ error: "API route not found" });
      }
    });
    return;
  }
  
  // For development or non-Vercel environments, try to serve static files
  const possiblePaths = [
    path.resolve(__dirname, "public"), // When copied to api/public
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"), // Fallback
    path.resolve(__dirname, "..", "public"), // Another fallback
    path.resolve(__dirname, "..", "..", "public"), // Additional fallback
    path.resolve(__dirname, "..", "..", "dist", "public"), // Additional fallback
    path.resolve(__dirname, "..", "..", "..", "public"), // Additional fallback
    path.resolve(__dirname, "..", "..", "..", "dist", "public") // Additional fallback
  ];

  let distPath: string | null = null;
  
  console.log("Checking paths for static files:");
  for (const testPath of possiblePaths) {
    const exists = fs.existsSync(testPath);
    console.log(`  ${exists ? '✓' : '✗'} ${testPath}`);
    if (exists) {
      distPath = testPath;
      break;
    }
  }

  if (!distPath) {
    console.error("=== No static files found ===");
    console.error("Tried the following paths for static files:");
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    
    app.use("*", (_req, res) => {
      res.status(404).json({ 
        error: "Static files not found", 
        message: "The client build files are not available. Please ensure the build completed successfully.",
        debug: {
          __dirname,
          cwd: process.cwd(),
          nodeEnv: process.env.NODE_ENV,
          isVercel
        }
      });
    });
    return;
  }

  console.log(`=== Serving static files from: ${distPath} ===`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath!, "index.html"));
  });
}

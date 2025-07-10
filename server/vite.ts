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
  // Try multiple possible paths for the build directory
  const possiblePaths = [
    path.resolve(__dirname, "public"), // When copied to api/public
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    "/var/task/public", // Vercel deployment path (api/public)
    "/var/task/dist/public", // Vercel deployment path
    path.resolve(process.cwd(), "public"), // Fallback
    path.resolve(__dirname, "..", "public") // Another fallback
  ];

  let distPath: string | null = null;
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      break;
    }
  }

  if (!distPath) {
    console.error("Tried the following paths for static files:");
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    
    // In Vercel, if we can't find the static files, we'll serve a simple fallback
    console.log("Static files not found, serving fallback response");
    app.use("*", (_req, res) => {
      res.status(404).json({ 
        error: "Static files not found", 
        message: "The client build files are not available. Please ensure the build completed successfully." 
      });
    });
    return;
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath!, "index.html"));
  });
}

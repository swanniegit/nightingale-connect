import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
    // Removed dynamic import for cartographer plugin for Vercel/server builds
  ],
  resolve: {
    alias: {
      "@": "client/src",
      "@shared": "shared",
      "@assets": "attached_assets",
      "useAuth": "useAuth.ts",
    },
  },
  root: "client",
  build: {
    outDir: "../public", // relative to root (client) - Vercel expects 'public'
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

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
      "client/src": "/client/src",
    },
  },
  root: "client",
  build: {
    outDir: "../dist/public", // relative to root (client)
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

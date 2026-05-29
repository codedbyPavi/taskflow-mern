import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_TARGET = process.env.VITE_API_PROXY_TARGET || "http://localhost:5000";
const ALLOWED_ORIGIN = process.env.VITE_API_PROXY_ORIGIN || "http://localhost:5173";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        configure(proxy) {
          proxy.on("proxyReq", (proxyReq) => {
            // Backend CORS only allows specific localhost ports.
            // Rewrite Origin so dev works regardless of Vite port.
            proxyReq.setHeader("origin", ALLOWED_ORIGIN);
          });
        }
      }
    }
  }
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'maps-vendor': ['@react-google-maps/api'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  define: {
    // Ensure environment variables are available at build time
    'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
    'process.env.VITE_CONVEX_URL': JSON.stringify(process.env.VITE_CONVEX_URL),
    'process.env.VITE_AUTH0_DOMAIN': JSON.stringify(process.env.VITE_AUTH0_DOMAIN),
    'process.env.VITE_AUTH0_CLIENT_ID': JSON.stringify(process.env.VITE_AUTH0_CLIENT_ID),
  },
});

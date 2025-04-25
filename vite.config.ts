import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Bisa diakses dari jaringan lain
    port: 3000, // Ganti dengan port yang diinginkan
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '')
      },
    }, // This closing brace was missing
  },

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

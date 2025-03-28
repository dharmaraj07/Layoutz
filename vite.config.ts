import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/", // 👈 Correct for GitHub Pages
  server: {
    host: "0.0.0.0", // Better compatibility
    port: 8080,
  },
  build: {
    outDir: "dist", // Ensure correct output directory
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
});
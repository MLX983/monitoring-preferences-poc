import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project URL: https://<user>.github.io/monitoring-preferences-poc/
// Match delegated-authority-poc: production base only on CI so local dev stays at "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/monitoring-preferences-poc/" : "/",
});

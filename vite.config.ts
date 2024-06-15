import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "ES2022",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("districts.json")) {
            return "districts";
          } else if (id.includes("areas.json")) {
            return "areas";
          } else {
            return "index";
          }
        },
      },
    },
  },
});

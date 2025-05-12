import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // jangan dikasih ./, karena akan error
  define: {
    "process.env": {},
  },
  build: {
    chunkSizeWarningLimit: 1000, // Setel ke 1000 kB (1 MB)
  },
});

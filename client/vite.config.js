import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import envCompatible from "vite-plugin-env-compatible";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible()], // Sử dụng plugin envCompatible để hỗ trợ biến môi trường
});

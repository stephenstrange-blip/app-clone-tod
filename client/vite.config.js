import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview, isSsrBuild }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  console.log(env.VITE_PORT);
  console.log("command: ", command, " mode: ", mode);

  if (command === "build") {
    return {
      plugins: [react()],
      build: {
        assetsInlineLimit: 0,
      },
      server: {
        port: 5175,
        strictPort: true,
      },
    };
  }

  if (command === "serve") {
    return {
      plugins: [react()],
      server: {
        port: 5172,
        strictPort: true,
        proxy: {
          "/api": {
            target: "http://localhost:8080",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
        },
      },
    };
  }
});

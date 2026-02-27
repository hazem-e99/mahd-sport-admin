import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
    },
    envDir: "./",
    envPrefix: "VITE_",
    define: {
      ...Object.keys(env).reduce((prev: Record<string, string>, key) => {
        if (key.startsWith("VITE_")) {
          prev[`import.meta.env.${key}`] = JSON.stringify(env[key]);
        }
        return prev;
      }, {}),
    },
  };
});

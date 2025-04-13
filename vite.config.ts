
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    server: {
      host: env.VITE_SERVER_HOST || "::",
      port: 8080, // Set port to 8080 for Lovable
    },
    plugins: [
      react(),
    ],
    css: {
      postcss: './postcss.config.js'
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Production optimizations
      minify: isProd ? 'terser' : false,
      sourcemap: !isProd,
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
            'data-vendor': ['zustand', '@tanstack/react-query']
          }
        }
      }
    },
  };
});

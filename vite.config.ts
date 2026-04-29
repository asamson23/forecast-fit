import { defineConfig } from 'vite';

const basePath = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});

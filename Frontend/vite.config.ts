import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,   // allows access from LAN (e.g., http://192.168.x.x:5173)
    port: 5173,   // optional, defaults to 5173
  },
});

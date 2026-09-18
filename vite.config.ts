import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4178,
    strictPort: true,
    // Allows temporary public demo tunnels (localtunnel.me / localhost.run)
    // to reach this dev server (Vite blocks unrecognized Host headers by default).
    allowedHosts: ['.loca.lt', '.lhr.life'],
  },
  preview: {
    host: '0.0.0.0',
    port: 4178,
    strictPort: true,
  },
});

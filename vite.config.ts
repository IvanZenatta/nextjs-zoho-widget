import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Why each option matters for a Zoho widget:
// - base: './'  -> assets resolve relative to widget.html. Zoho serves the
//                  widget from a nested path, so absolute "/assets/..." URLs 404.
// - outDir: 'app' -> ZET serves and packs the "app" folder. Vite builds straight
//                    into it so there is no copy step.
// - input: widget.html -> keeps the entry filename ZET expects (app/widget.html)
//                         instead of Vite's default index.html.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'app',
    emptyOutDir: true,
    rollupOptions: {
      input: 'widget.html',
    },
  },
  server: {
    port: 5173,
    // ngrok tunnels send a Host header Vite rejects by default. Allow any
    // ngrok subdomain so the URL changing between sessions doesn't break it.
    allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'],
  },
})

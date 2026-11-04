import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wedding, display, images } from './src/wedding.config.js'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const weddingMeta = {
  name: 'wedding-meta',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html
        .replaceAll('__TITLE__', esc(`${wedding.groom} & ${wedding.bride} — Wedding Invitation`))
        .replaceAll('__DESCRIPTION__', esc(`A special wedding invitation for ${wedding.groom} & ${wedding.bride} — ${display.dateLong}, ${display.where}.`))
        .replaceAll('__OG_IMAGE__', esc(images.og)),
  },
}

// base comes from wedding.config.js (wedding.basePath) — must match the GitHub repo name
export default defineConfig({
  plugins: [react(), weddingMeta],
  base: wedding.basePath,
  server: {
    host: true,                       // expose on the local network (same as --host)
    allowedHosts: ['.trycloudflare.com'], // allow any Cloudflare Tunnel subdomain
  },
})

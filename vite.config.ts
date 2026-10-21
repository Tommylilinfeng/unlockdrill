import { existsSync, readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Writes the Google tag into index.html itself when VITE_GA_ID is set, so the tag is in the
 * page source on every route (crawlers and tag checkers read the HTML, not the running app).
 * Page views are sent from the router (src/lib/analytics.ts), so the config disables the automatic one.
 */
function googleTag(id: string | undefined): Plugin {
  return {
    name: 'google-tag',
    transformIndexHtml() {
      if (!id) return []
      return [
        { tag: 'script', attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}` }, injectTo: 'head-prepend' },
        {
          tag: 'script',
          children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{send_page_view:false});`,
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// A custom domain is turned on by adding public/CNAME (GitHub Pages reads the same file): the build then
// serves from the domain root and uses it as the site URL, whatever the workflow passes.
const cname = existsSync('public/CNAME') ? readFileSync('public/CNAME', 'utf8').trim() : ''
if (cname) process.env.VITE_SITE_URL = `https://${cname}`

// VITE_BASE lets the same build run at a sub-path (GitHub Pages: /unlockdrill/) or at the root of a custom domain.
export default defineConfig({
  base: cname ? '/' : process.env.VITE_BASE || '/',
  plugins: [react(), googleTag(process.env.VITE_GA_ID)],
})

import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
// import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    // server: {
    //   port : 3000,
  //   proxy: {
  //     '/api': {
  //       target: 'https://apis.aej-ci.net',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, '/public/api')
  //     }
  //   }
  // },
  // plugins: [
  //   TanStackRouterVite(),
  //   react(),
  //   tailwindcss()
  // ],
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //   },
  // },

  server: {
    port: 3000,
    // Dev proxy: the browser talks to the SPA origin (localhost:3000) for the API
    // too, so Sanctum's XSRF-TOKEN cookie is first-party (readable by JS → axios
    // can echo X-XSRF-TOKEN) and there's no CORS. Requests still originate from
    // http://localhost:3000, which the backend already trusts as stateful.
    // `target` includes the /public prefix so /api/* → /public/api/* upstream.
    proxy: {
      '/api': {
        target: 'https://apis.aej-ci.net/public',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
      },
      '/sanctum': {
        target: 'https://apis.aej-ci.net/public',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
})

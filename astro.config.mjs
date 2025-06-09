// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),

  vite: {
    ssr: {
      noExternal: []
    },
    define: {
      // Define variáveis do Mercado Pago para o frontend
      'import.meta.env.PUBLIC_MP_PUBLIC_KEY': JSON.stringify(process.env.PUBLIC_MP_PUBLIC_KEY),
      'process.env.MP_ACCESS_TOKEN': JSON.stringify(process.env.MP_ACCESS_TOKEN),
    }
  },

  integrations: [react(), tailwind()],

  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless'
    }
  }
});
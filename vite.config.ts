import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Em desenvolvimento o proxy injeta a API key (de .env) nas chamadas ao
// OpenWeatherMap; em produção a função serverless api/ow.ts faz esse papel.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.OPENWEATHER_API_KEY ?? '';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/ow': {
          target: 'https://api.openweathermap.org',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const endpoint = url.searchParams.get('endpoint') ?? 'weather';
            url.searchParams.delete('endpoint');
            url.searchParams.set('appid', apiKey);
            return `/data/2.5/${endpoint}?${url.searchParams.toString()}`;
          },
        },
      },
    },
  };
});

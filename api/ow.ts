// Proxy serverless para o OpenWeatherMap — mantém a API key fora do cliente.
// Uso: /api/ow?endpoint=weather&q=São Paulo&units=metric&lang=pt_br

const ALLOWED_ENDPOINTS = new Set(['weather', 'forecast', 'uvi', 'air_pollution']);
const ALLOWED_PARAMS = new Set(['q', 'lat', 'lon', 'units', 'lang', 'cnt']);

export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'OPENWEATHER_API_KEY não configurada' }, { status: 500 });
  }

  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint') ?? '';
  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return Response.json({ error: 'Endpoint inválido' }, { status: 400 });
  }

  const upstream = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`);
  for (const [key, value] of url.searchParams) {
    if (ALLOWED_PARAMS.has(key)) upstream.searchParams.set(key, value);
  }
  upstream.searchParams.set('appid', apiKey);

  const response = await fetch(upstream);
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}

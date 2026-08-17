// Proxy serverless para o OpenWeatherMap — mantém a API key fora do cliente.
// Uso: /api/ow?endpoint=weather&q=São Paulo&units=metric&lang=pt_br

const ALLOWED_ENDPOINTS = new Set(['weather', 'forecast', 'uvi', 'air_pollution']);
const ALLOWED_PARAMS = new Set(['q', 'lat', 'lon', 'units', 'lang', 'cnt']);
const UPSTREAM_TIMEOUT_MS = 8000;

// Só atende chamadas feitas a partir das páginas servidas por este mesmo host.
// Cabe a produção, previews e domínios próprios sem lista fixa. Ver ADR-0001:
// é lombada contra uso oportunista do proxy, não autenticação.
function isSameOrigin(request: Request): boolean {
  const host = request.headers.get('host');
  if (!host) return false;

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // Navegadores que suprimem o Referer ainda enviam Sec-Fetch-Site.
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'OPENWEATHER_API_KEY não configurada' }, { status: 500 });
  }

  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Origem não autorizada' }, { status: 403 });
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

  let response: Response;
  try {
    response = await fetch(upstream, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
  } catch {
    return Response.json(
      { error: 'Serviço de clima indisponível' },
      { status: 504, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      // Erros nunca vão para o cache de borda: uma janela de 429 ou 401 não
      // pode congelar por 5 minutos depois de já ter passado.
      'Cache-Control': response.ok ? 's-maxage=300, stale-while-revalidate=600' : 'no-store',
    },
  });
}

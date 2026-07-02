# Clima·Tempo

Aplicação de previsão do tempo com visual que reage ao céu: o painel principal muda de gradiente e ambiente (estrelas, chuva, nuvens em movimento) conforme a condição climática real da cidade consultada.

## Funcionalidades

- **Clima atual** — temperatura, sensação térmica, mínima/máxima, nascer e pôr do sol
- **Indicadores** — umidade, vento (com direção), probabilidade de chuva, índice UV, qualidade do ar, visibilidade e pressão
- **Previsão horária** — próximas 24 horas em intervalos de 3h
- **Previsão diária** — próximos 5 dias com barra de faixa térmica comparativa
- **Busca com autocomplete** — sugestões de cidades via Nominatim (OpenStreetMap)
- **Geolocalização** — detecta a cidade do usuário na abertura
- **Tema claro/escuro** — com persistência e respeito ao `prefers-color-scheme`
- **Acessibilidade** — foco visível, rótulos ARIA e suporte a `prefers-reduced-motion`

## Stack

| Camada | Tecnologia |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Estilo | CSS moderno com design tokens (sem frameworks) |
| Dados | OpenWeatherMap + Nominatim |
| API segura | Vercel Serverless Function (`api/ow.ts`) — a chave nunca chega ao navegador |
| Hospedagem | Vercel |

Tipografia: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) (display) + [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (dados).

## Rodando localmente

```bash
# 1. Instale as dependências
npm install

# 2. Configure a chave da API (https://openweathermap.org/api)
cp .env.example .env
# edite .env e informe OPENWEATHER_API_KEY

# 3. Suba o servidor de desenvolvimento
npm run dev
```

Em desenvolvimento, o proxy do Vite injeta a chave nas chamadas ao OpenWeatherMap. Em produção, a função serverless `api/ow.ts` faz esse papel usando a variável de ambiente `OPENWEATHER_API_KEY` configurada na Vercel.

## Deploy

```bash
vercel --prod
```

Configure a variável `OPENWEATHER_API_KEY` no painel da Vercel (Settings → Environment Variables) ou via CLI:

```bash
vercel env add OPENWEATHER_API_KEY production
```

## Estrutura

```
api/ow.ts              # proxy serverless do OpenWeatherMap
src/
  components/          # SkyPanel, StatGrid, Forecast, SearchBar, ícones SVG
  hooks/               # useWeather, useTheme, useDebouncedValue
  lib/                 # cliente de API, formatação, mapeamento de condições
  types/               # tipos das respostas da API
  styles/global.css    # design tokens + temas + animações
```

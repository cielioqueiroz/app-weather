# 🌤️ Clima Tempo - Aplicação de Previsão do Tempo

Uma aplicação web moderna e responsiva para consultar informações meteorológicas em tempo real com suporte a tema claro/escuro e uma interface intuitiva com cards informativos.

![Weather App](https://img.shields.io/badge/Status-Ativo-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Made with Claude](https://img.shields.io/badge/Made%20with-Claude%20Code-orange)

## 📋 Funcionalidades Principais

### 🌡️ Informações Atuais (em tempo real)
- **Temperatura atual** com ícone dinâmico do clima
- **Sensação térmica** - percepção real da temperatura
- **Umidade** - percentual de umidade do ar
- **Velocidade do Vento** - com SVG icons e direção (N, NE, L, etc)
- **Chance de Chuva** - probabilidade de precipitação
- **Índice UV** - nível de radiação ultravioleta
- **Qualidade do Ar (AQI)** - em tempo real com classificação
- **Visibilidade** - em quilômetros
- **Pressão Atmosférica** - em hectopascais
- **Nascer e Pôr do Sol** - com horários precisos

### 📈 Previsões Detalhadas

#### Tab "Hoje" (Próximas 4 horas)
- Hora da previsão
- Ícone do clima
- Temperatura
- **Micro-informações em linha:**
  - 💨 Velocidade do vento
  - 👁️ Visibilidade
  - ☀️ Índice UV

#### Tab "Próximos Dias"
- Data e dia da semana
- Ícone climático
- Temperatura mínima e máxima
- Chance de chuva
- Visibilidade
- Pressão
- Velocidade do vento com direção cardinal

### 🎨 Experiência do Usuário

- ✨ **Modo Claro/Escuro** - Alternância automática entre temas
  - Tema Escuro: Cores escuras com accent dourado (#ffde59)
  - Tema Claro: Cores claras com accent laranja (#C84B31)
- 📱 **Design Totalmente Responsivo**
  - Desktop (1024px+): Grid 4 colunas
  - Tablet (768px-1023px): Grid 2 colunas
  - Mobile (480px-767px): Layout adaptado
  - Extra pequeno (<480px): Stack vertical
- 🔍 **Busca Inteligente** - Autocompletar de cidades com Nominatim
- 📍 **Sugestões em Tempo Real** - Dropdown com sugestões enquanto digita
- ⚡ **Loading Spinner** - Feedback visual durante carregamento
- 🎯 **Animações Suaves** - Transições e hover effects
- 🫙 **Glassmorphism** - Design moderno com blur effects

## 🚀 Como Usar

### Configuração Local

1. **Clone o repositório**
```bash
git clone https://github.com/cielioqueiroz/app-weather.git
cd app-weather
```

2. **Obtenha uma chave de API (grátis)**
   - Acesse [openweathermap.org/api](https://openweathermap.org/api)
   - Crie uma conta
   - Gere uma chave de API na seção "API Keys"

3. **Configure a chave de API**
   
   Crie o arquivo `config/environment.js`:
   ```javascript
   export const apiKey = 'sua-chave-openweathermap-aqui';
   ```

4. **Inicie um servidor local**
   ```bash
   # Usando Python 3
   python -m http.server 8000
   
   # Usando Python 2
   python -m SimpleHTTPServer 8000
   
   # Usando Node.js
   npx http-server
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:8000
   ```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Flexbox, Grid, Animações, Backdrop Filter, Media Queries
- **JavaScript (ES6+)** - Lógica moderna e eficiente
- **Luxon.js** - Manipulação de datas e horários com timezones
- **Ionicons** - Ícones SVG para interface

### APIs Externas
- **[OpenWeather API](https://openweathermap.org/api)**
  - Current Weather Data
  - 5 Day / 3 Hour Forecast
  - UV Index
  - Air Pollution/AQI
- **[Nominatim API](https://nominatim.org/)** - Geocodificação e busca de cidades

## 📁 Estrutura do Projeto

```
app-weather/
├── config/
│   └── environment.js          # Configuração API (não commitado)
├── css/
│   └── style.css               # Estilos globais, responsivos e temas
├── img/
│   ├── clear.png               # Clima ensolarado
│   ├── cloud.png               # Nublado
│   ├── rain.png                # Chuva
│   ├── mist.png                # Neblina/Névoa
│   ├── snow.png                # Neve
│   ├── cloud.png               # Favicon
│   └── background.jpeg         # Fundo do tema escuro
├── index.html                  # Estrutura HTML principal
├── main.js                     # Lógica da aplicação
├── README.md                   # Esta documentação
└── .gitignore                  # Exclusões do git
```

## 🎯 Funcionalidades Técnicas Avançadas

### Responsividade
- Grid layout com breakpoints: 1024px, 768px, 480px
- Flexbox para alinhamento preciso
- Media queries customizadas
- Imagens otimizadas

### Performance
- Lazy loading
- Debounce em buscas (300ms)
- Caching de tema no localStorage
- Animações otimizadas com CSS

### Qualidade de Código
- Variáveis CSS para fácil customização
- Funções modularizadas
- Tratamento de erros robusto
- Comentários onde necessário

### Acessibilidade
- Semântica HTML apropriada
- Cores com bom contraste
- Títulos descritivos em elementos interativos
- Suporte a navegação por teclado

## 🌙 Sistema de Temas

A aplicação possui dois temas completamente sincronizados:

### Tema Escuro (Padrão)
```css
--primary-bg: #1a1a2e
--primary-text: #ffffff
--accent-color: #ffde59
--secondary-text: #b0b0b0
```

### Tema Claro
```css
--primary-bg: #f5f5f5
--primary-text: #1a1a2e
--accent-color: #C84B31
--secondary-text: #4a4a4a
```

A preferência é armazenada no localStorage do navegador!

## 🔐 Segurança

- 🔒 Chave de API em arquivo local (não commitado)
- 📝 `.gitignore` configurado para proteger dados sensíveis
- ✅ HTTPS recomendado para produção
- 🛡️ Validação de entrada do usuário

## 🐛 Troubleshooting

### "Não encontra cidades"
- ✔️ Verifique sua chave de API do OpenWeather
- ✔️ Confirme que tem 1+ caractere na busca
- ✔️ Veja o console (F12) para mensagens de erro

### "Dados desatualizados"
- ✔️ Limpe o cache: `Ctrl+Shift+Delete`
- ✔️ Recarregue a página: `F5`

### "Ícones não aparecem"
- ✔️ Verifique a conexão com internet
- ✔️ Ionicons carrega via CDN
- ✔️ Abra o console (F12) para verificar erros

## 📊 Informações de Desenvolvimento

**Última atualização:** Maio 2026

**Versão atual:** 2.0
- ✨ SVG inline wind icons
- 📐 Alinhamento horizontal de forecasts
- 🐛 Correção de temperatura máxima
- 🎨 Reposicionamento de botão tema

## 👨‍💻 Autor

**Cielio Queiroz**
- 🔗 GitHub: [@cielioqueiroz](https://github.com/cielioqueiroz)
- 📧 Email: cielioqueiroz@hotmail.com

## 🤖 Créditos

Desenvolvido com ajuda de **[Claude Code](https://claude.com/claude-code)** (Anthropic)

## 📄 Licença

MIT License - Sinta-se livre para usar, modificar e distribuir!

---

<div align="center">

**⭐ Se gostou, deixe uma estrela no repositório!**

[🔝 Voltar ao topo](#-clima-tempo---aplicação-de-previsão-do-tempo)

</div>

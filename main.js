import { apiKey } from './config/environment.js';

const API_CONFIG = {
  weather: 'https://api.openweathermap.org/data/2.5/weather',
  forecast: 'https://api.openweathermap.org/data/2.5/forecast',
  nominatim: 'https://nominatim.openstreetmap.org/search',
  uvi: 'https://api.openweathermap.org/data/2.5/uvi',
  airPollution: 'https://api.openweathermap.org/data/2.5/air_pollution',
  units: 'metric',
  lang: 'pt_br',
  minSearchLength: 1,
  searchDelay: 300,
  errorDisplayDuration: 5000
};

const DOM_SELECTORS = {
  footerYear: '.footer-rights',
  searchButton: '#search',
  locationInput: '#location',
  citySuggestionsDropdown: '#citySuggestionsDropdown',
  weatherInfo: '.weather_info',
  weatherImage: '#weatherImage',
  temperature: '#temperature',
  weatherStatus: '#weatherStatus',
  cityName: '#cityName',
  feelsLike: '#feelsLike',
  humidity: '#humidity',
  windSpeed: '#windSpeed',
  rainChance: '#rainChance',
  tempMinMax: '#tempMinMax',
  sunriseSunset: '#sunriseSunset',
  windDirection: '#windDirection',
  uvValue: '#uvValue',
  aqiValue: '#aqiValue',
  visibilityValue: '#visibilityValue',
  pressureValue: '#pressureValue',
  dailyForecastList: '#dailyForecastList',
  themeToggle: '#themeToggle',
  hourlyGrid: '#hourlyGrid'
};

const WEATHER_ICONS = {
  clear: 'clear.png',
  clouds: 'cloud.png',
  rain: 'rain.png',
  mist: 'mist.png',
  snow: 'snow.png'
};

let suggestionsTimeout;

function showLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.remove('hidden');
  }
}

function hideLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.add('hidden');
  }
}

function debounce(func, delay) {
  return (...args) => {
    clearTimeout(suggestionsTimeout);
    suggestionsTimeout = setTimeout(() => func(...args), delay);
  };
}

function getTheme() {
  return localStorage.getItem('theme') || 'dark';
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  const body = document.body;
  if (theme === 'light') {
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeBtn = document.querySelector(DOM_SELECTORS.themeToggle);
  if (themeBtn) {
    const currentTheme = getTheme();
    themeBtn.innerHTML = currentTheme === 'light'
      ? '<ion-icon name="moon-outline"></ion-icon>'
      : '<ion-icon name="sunny-outline"></ion-icon>';
  }
}

function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function clearErrorDisplay() {
  const weatherContainer = document.querySelector(DOM_SELECTORS.weatherInfo);
  if (weatherContainer) {
    weatherContainer.innerHTML = '';
    weatherContainer.classList.remove('fade-in');
  }
}

function resetWeatherAnimation() {
  const weatherInfo = document.querySelector(DOM_SELECTORS.weatherInfo);
  if (weatherInfo) {
    weatherInfo.classList.remove('fade-in');
  }
}

function displayError(message) {
  hideLoading();
  const weatherContainer = document.querySelector(DOM_SELECTORS.weatherInfo);
  if (weatherContainer) {
    weatherContainer.innerHTML = `<p class="error">${message}</p>`;
    setTimeout(clearErrorDisplay, API_CONFIG.errorDisplayDuration);
  }
}

function getWeatherIconUrl(weatherMain) {
  const iconFile = WEATHER_ICONS[weatherMain.toLowerCase()] || WEATHER_ICONS.clear;
  return `./img/${iconFile}`;
}

function getWindDirection(degrees) {
  const directions = ['Norte', 'Nordeste', 'Leste', 'Sudeste', 'Sul', 'Sudoeste', 'Oeste', 'Noroeste'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function getAQILabel(aqi) {
  const labels = ['', 'Boa', 'Razoável', 'Moderada', 'Ruim', 'Péssima'];
  return labels[aqi] || '--';
}

async function getHourlyForecast(lat, lon) {
  try {
    const response = await fetch(
      `${API_CONFIG.forecast}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${API_CONFIG.units}&lang=${API_CONFIG.lang}&cnt=40`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.list || [];
  } catch (error) {
    console.error('Erro ao buscar previsão horária:', error);
    return [];
  }
}

async function getUVIndex(lat, lon) {
  try {
    const response = await fetch(
      `${API_CONFIG.uvi}?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.value ?? null;
  } catch (error) {
    console.error('Erro ao buscar índice UV:', error);
    return null;
  }
}

async function getAirQuality(lat, lon) {
  try {
    const response = await fetch(
      `${API_CONFIG.airPollution}?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    const aqi = data.list?.[0]?.main?.aqi ?? null;
    return aqi !== null ? { value: aqi, label: getAQILabel(aqi) } : null;
  } catch (error) {
    console.error('Erro ao buscar qualidade do ar:', error);
    return null;
  }
}

function displayHourlyForecast(hourlyData, timezoneOffset, uvIndex = null) {
  const hourlyGrid = document.getElementById('hourlyGrid');
  if (!hourlyGrid) return;

  hourlyGrid.innerHTML = '';

  hourlyData.forEach((hour, index) => {
    const time = luxon.DateTime.fromSeconds(hour.dt)
      .plus({ seconds: timezoneOffset })
      .toFormat('HH:mm');

    const temp = Math.round(hour.main.temp);
    const weatherIcon = hour.weather[0].main;
    const iconUrl = getWeatherIconUrl(weatherIcon);
    const windSpeed = (hour.wind.speed * 3.6).toFixed(1);
    const visibility = (hour.visibility / 1000).toFixed(1);
    const uv = uvIndex || '--';

    const hourlyItem = document.createElement('div');
    hourlyItem.className = 'hourly-item';
    hourlyItem.innerHTML = `
      <div class="hourly-time">${time}</div>
      <img src="${iconUrl}" alt="clima" style="width: 35px; height: 35px;">
      <div class="hourly-temp">${temp}°C</div>
      <div class="hourly-details">
        <div class="hourly-detail-row">
          <ion-icon name="wind-outline" class="hourly-detail-icon"></ion-icon>
          <span class="hourly-detail-text">${windSpeed}km/h</span>
        </div>
        <div class="hourly-detail-row">
          <ion-icon name="eye-outline" class="hourly-detail-icon"></ion-icon>
          <span class="hourly-detail-text">${visibility}km</span>
        </div>
        <div class="hourly-detail-row">
          <ion-icon name="sunny-outline" class="hourly-detail-icon"></ion-icon>
          <span class="hourly-detail-text">UV ${uv}</span>
        </div>
      </div>
    `;

    hourlyGrid.appendChild(hourlyItem);
  });
}

function getDailyForecastByDay(forecastList, timezoneOffset) {
  const dayMap = new Map();

  forecastList.forEach(entry => {
    const localDate = luxon.DateTime.fromSeconds(entry.dt)
      .setZone('UTC')
      .plus({ seconds: timezoneOffset })
      .toFormat('yyyy-MM-dd');

    if (!dayMap.has(localDate)) {
      dayMap.set(localDate, []);
    }
    dayMap.get(localDate).push(entry);
  });

  const PT_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const days = [];

  dayMap.forEach((entries, dateStr) => {
    const dt = luxon.DateTime.fromISO(dateStr);
    const dayName = PT_DAYS[dt.weekday % 7];

    const temps = entries.map(e => e.main.temp);
    const tempMin = Math.round(Math.min(...temps));
    const tempMax = Math.round(Math.max(...temps));

    const midday = entries.reduce((closest, entry) => {
      const hour = luxon.DateTime.fromSeconds(entry.dt)
        .setZone('UTC')
        .plus({ seconds: timezoneOffset })
        .hour;
      const currentHour = luxon.DateTime.fromSeconds(closest.dt)
        .setZone('UTC')
        .plus({ seconds: timezoneOffset })
        .hour;
      return Math.abs(hour - 12) < Math.abs(currentHour - 12) ? entry : closest;
    });

    const rainProb = Math.round(Math.max(...entries.map(e => (e.pop || 0))) * 100);
    const visibility = Math.round(midday.visibility / 1000 * 10) / 10;
    const pressure = midday.main.pressure;
    const windSpeed = (midday.wind.speed * 3.6).toFixed(1);
    const windDeg = midday.wind.deg;

    days.push({
      dateStr,
      dayName,
      weatherMain: midday.weather[0].main,
      tempMin,
      tempMax,
      rainProb,
      visibility,
      pressure,
      windSpeed,
      windDeg
    });
  });

  return days;
}

function displayDailyForecast(dailyData) {
  const list = document.getElementById('dailyForecastList');
  if (!list) return;
  list.innerHTML = '';

  dailyData.forEach(day => {
    const iconUrl = getWeatherIconUrl(day.weatherMain);
    const dateObj = luxon.DateTime.fromISO(day.dateStr);
    const formattedDate = dateObj.toFormat('dd/MM');
    const windDir = getWindDirection(day.windDeg);

    const item = document.createElement('div');
    item.className = 'daily-forecast-item';
    item.innerHTML = `
      <div class="daily-column daily-date-info">
        <div class="daily-date">${formattedDate}</div>
        <div class="daily-day-name">${day.dayName}</div>
      </div>

      <div class="daily-column daily-weather-column">
        <img class="daily-icon" src="${iconUrl}" alt="${day.weatherMain}">
        <div class="daily-temps-inline">
          <span class="temp-min">MÍN ${day.tempMin}°</span>
          <span class="temp-max">MÁX ${day.tempMax}°</span>
        </div>
      </div>

      <div class="daily-column daily-detail-column">
        <ion-icon name="rainy-outline" class="detail-icon"></ion-icon>
        <span class="detail-label">Chuva</span>
        <span class="detail-value">${day.rainProb}%</span>
      </div>

      <div class="daily-column daily-detail-column">
        <ion-icon name="eye-outline" class="detail-icon"></ion-icon>
        <span class="detail-label">Visib.</span>
        <span class="detail-value">${day.visibility}km</span>
      </div>

      <div class="daily-column daily-detail-column">
        <ion-icon name="speedometer-outline" class="detail-icon"></ion-icon>
        <span class="detail-label">Pressão</span>
        <span class="detail-value">${day.pressure}hPa</span>
      </div>

      <div class="daily-column daily-detail-column">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" class="detail-icon wind-svg">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
        </svg>
        <span class="detail-label">Vento</span>
        <div class="wind-info-inline">
          <span class="detail-value">${day.windSpeed}km/h</span>
          <span class="wind-direction-small">${windDir}</span>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

function displayWeatherData(data, isCurrentLocation = false, locationInfo = null) {
  const elements = {
    image: document.getElementById('weatherImage'),
    temperature: document.getElementById('temperature'),
    status: document.getElementById('weatherStatus'),
    city: document.getElementById('cityName'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    rainChance: document.getElementById('rainChance'),
    tempMin: document.getElementById('tempMin'),
    tempMax: document.getElementById('tempMax'),
    sunriseSunset: document.getElementById('sunriseSunset'),
    windDirection: document.getElementById('windDirection'),
    uvValue: document.getElementById('uvValue'),
    aqiValue: document.getElementById('aqiValue'),
    visibilityValue: document.getElementById('visibilityValue'),
    pressureValue: document.getElementById('pressureValue')
  };

  const coreElements = ['image', 'temperature', 'status', 'city', 'feelsLike', 'humidity', 'windSpeed', 'tempMin', 'tempMax'];
  const hasCoreElements = coreElements.every(key => elements[key] !== null);
  if (!hasCoreElements) {
    console.error('Elementos DOM principais não foram encontrados');
    return;
  }

  const weatherDescription = data.weather[0].description;
  const weatherMain = data.weather[0].main;

  elements.image.src = getWeatherIconUrl(weatherMain);
  elements.temperature.textContent = `${Math.round(data.main.temp)} °C`;
  elements.status.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

  let cityDisplay = data.name;
  if (locationInfo && locationInfo.city) {
    const parts = [locationInfo.city];
    if (locationInfo.state) parts.push(locationInfo.state);
    if (locationInfo.country) parts.push(locationInfo.country);
    cityDisplay = parts.join(', ');
  } else {
    const countryCode = data.sys?.country || '';
    cityDisplay = countryCode ? `${data.name}, ${countryCode}` : data.name;
  }

  elements.city.textContent = cityDisplay;

  elements.feelsLike.querySelector('.info-value').textContent = `${Math.round(data.main.feels_like)} °C`;
  elements.humidity.querySelector('.info-value').textContent = `${data.main.humidity}%`;

  const windKmh = (data.wind.speed * 3.6).toFixed(1);
  const windDir = getWindDirection(data.wind.deg);
  elements.windSpeed.querySelector('.info-value').textContent = `${windKmh} km/h`;
  if (elements.windDirection) {
    elements.windDirection.textContent = windDir;
  }

  if (elements.tempMin && elements.tempMax) {
    elements.tempMin.textContent = `--°`;
    elements.tempMax.textContent = `--°`;
  }

  if (elements.sunriseSunset) {
    const sunrise = luxon.DateTime.fromSeconds(data.sys.sunrise)
      .setZone('UTC')
      .plus({ seconds: data.timezone })
      .toFormat('HH:mm');
    const sunset = luxon.DateTime.fromSeconds(data.sys.sunset)
      .setZone('UTC')
      .plus({ seconds: data.timezone })
      .toFormat('HH:mm');
    elements.sunriseSunset.textContent = `☀ Nascer ${sunrise}   🌙 Pôr ${sunset}`;
  }

  if (elements.visibilityValue) {
    const visKm = (data.visibility / 1000).toFixed(1);
    elements.visibilityValue.textContent = `${visKm} km`;
  }

  if (elements.pressureValue) {
    elements.pressureValue.textContent = `${data.main.pressure} hPa`;
  }

  const weatherInfo = document.querySelector(DOM_SELECTORS.weatherInfo);
  if (weatherInfo) {
    weatherInfo.classList.add('fade-in');
  }

  const lat = data.coord.lat;
  const lon = data.coord.lon;

  Promise.all([
    getHourlyForecast(lat, lon),
    getUVIndex(lat, lon),
    getAirQuality(lat, lon)
  ]).then(([forecastList, uvValue, aqData]) => {
    if (forecastList.length > 0) {
      const uvDisplay = uvValue ? Math.round(uvValue) : null;
      displayHourlyForecast(forecastList.slice(0, 4), data.timezone, uvDisplay);

      if (elements.rainChance) {
        const pop = Math.round((forecastList[0].pop || 0) * 100);
        elements.rainChance.querySelector('.info-value').textContent = `${pop}%`;
      }

      const dailyData = getDailyForecastByDay(forecastList, data.timezone);

      if ((elements.tempMin && elements.tempMax) && dailyData.length > 0) {
        const todayData = dailyData[0];
        const currentTemp = Math.round(data.main.temp);
        const tMin = Math.round(todayData.tempMin);
        const tMax = Math.max(currentTemp, Math.round(todayData.tempMax));
        elements.tempMin.textContent = `${tMin}°`;
        elements.tempMax.textContent = `${tMax}°`;
      }

      displayDailyForecast(dailyData.slice(1));
    }

    if (uvValue !== null && elements.uvValue) {
      elements.uvValue.textContent = uvValue.toFixed(1);
    }

    if (aqData && elements.aqiValue) {
      elements.aqiValue.textContent = `${aqData.value} - ${aqData.label}`;
    }
  });

  hideLoading();
}

async function getWeatherData(city, country = '') {
  try {
    resetWeatherAnimation();
    let query = city;
    if (country) {
      query = `${city},${country}`;
    }

    const response = await fetch(
      `${API_CONFIG.weather}?q=${encodeURIComponent(query)}&appid=${apiKey}&units=${API_CONFIG.units}&lang=${API_CONFIG.lang}`
    );

    if (!response.ok) {
      if (country) {
        return await getWeatherData(city);
      }
      throw new Error('Cidade não encontrada');
    }

    const data = await response.json();
    const locationInfo = await getLocationInfoFromCoords(data.coord.lat, data.coord.lon);
    displayWeatherData(data, false, locationInfo);
    closeSuggestions();
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    displayError(error.message);
  }
}

async function getLocationInfoFromCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const address = data.address || {};

    return {
      city: address.city || address.town || address.village || '',
      state: address.state || address.county || '',
      country: address.country || ''
    };
  } catch (error) {
    console.error('Erro ao buscar localização:', error);
    return null;
  }
}

async function getWeatherDataByCoords(lat, lon) {
  try {
    resetWeatherAnimation();
    const [weatherResponse, locationInfo] = await Promise.all([
      fetch(
        `${API_CONFIG.weather}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${API_CONFIG.units}&lang=${API_CONFIG.lang}`
      ),
      getLocationInfoFromCoords(lat, lon)
    ]);

    if (!weatherResponse.ok) {
      throw new Error('Localização não encontrada');
    }

    const data = await weatherResponse.json();
    displayWeatherData(data, true, locationInfo);
  } catch (error) {
    console.error('Erro ao buscar dados por coordenadas:', error);
    displayError(error.message);
  }
}

async function getCitySuggestions(query) {
  try {
    const response = await fetch(
      `${API_CONFIG.nominatim}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&countrycodes=`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar sugestões');
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.map(place => {
        const address = place.address || {};
        const name = place.name || '';
        const city = address.city || address.town || address.village || '';
        const state = address.state || '';
        const country = address.country || '';

        return {
          name: city || name,
          country: country,
          adminName: state,
          lat: place.lat,
          lng: place.lng,
          displayName: place.display_name
        };
      }).filter(place => place.name && place.country);
    }

    return [];
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    return [];
  }
}

function showCitySuggestions(suggestions) {
  const dropdown = document.querySelector(DOM_SELECTORS.citySuggestionsDropdown);
  if (!dropdown) return;

  if (suggestions.length === 0) {
    dropdown.classList.remove('active');
    return;
  }

  dropdown.innerHTML = '';

  suggestions.forEach(suggestion => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';

    let displayText = suggestion.name;
    if (suggestion.adminName) {
      displayText += `, ${suggestion.adminName}`;
    }
    if (suggestion.country) {
      displayText += `, ${suggestion.country}`;
    }

    item.textContent = displayText;
    item.title = suggestion.displayName || displayText;

    item.addEventListener('click', () => {
      const locationInput = document.querySelector(DOM_SELECTORS.locationInput);
      locationInput.value = displayText;
      showLoading();
      getWeatherData(suggestion.name, suggestion.country);
    });

    dropdown.appendChild(item);
  });

  dropdown.classList.add('active');
}

function closeSuggestions() {
  const dropdown = document.querySelector(DOM_SELECTORS.citySuggestionsDropdown);
  if (dropdown) {
    dropdown.classList.remove('active');
  }
}

function initializeUI() {
  showLoading();

  const footerYear = document.querySelector(DOM_SELECTORS.footerYear);
  if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} Clima Tempo. Todos os direitos reservados.`;
  }

  const currentTheme = getTheme();
  setTheme(currentTheme);

  const themeBtn = document.querySelector(DOM_SELECTORS.themeToggle);
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  const searchButton = document.querySelector(DOM_SELECTORS.searchButton);
  const locationInput = document.querySelector(DOM_SELECTORS.locationInput);

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const location = locationInput.value.trim();
      if (location) {
        showLoading();
        const [city, country] = location.split(',').map(part => part.trim());
        getWeatherData(city, country);
      } else {
        displayError('Por favor, insira o nome de uma cidade.');
      }
    });
  }

  if (locationInput) {
    locationInput.addEventListener('keyup', async (event) => {
      const query = locationInput.value.trim();

      if (event.key === 'Enter') {
        if (query) {
          showLoading();
          const [city, country] = query.split(',').map(part => part.trim());
          getWeatherData(city, country);
        } else {
          displayError('Por favor, insira o nome de uma cidade.');
        }
      } else if (query.length > API_CONFIG.minSearchLength) {
        const debouncedSearch = debounce(async (q) => {
          const suggestions = await getCitySuggestions(q);
          showCitySuggestions(suggestions);
        }, API_CONFIG.searchDelay);
        debouncedSearch(query);
      } else {
        closeSuggestions();
      }
    });

    locationInput.addEventListener('blur', () => {
      setTimeout(closeSuggestions, 200);
    });

    locationInput.addEventListener('focus', async () => {
      const query = locationInput.value.trim();
      if (query.length > API_CONFIG.minSearchLength) {
        const suggestions = await getCitySuggestions(query);
        showCitySuggestions(suggestions);
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search_section')) {
      closeSuggestions();
    }
  });

  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));

      btn.classList.add('active');
      const targetId = btn.dataset.tab === 'hoje' ? 'tabHoje' : 'tabProximos';
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.remove('hidden');
    });
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherDataByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        displayError('Não foi possível obter a localização. Por favor, insira o nome da cidade.');
      }
    );
  } else {
    displayError('Geolocalização não é suportada pelo navegador. Por favor, insira o nome da cidade.');
  }
}

document.addEventListener('DOMContentLoaded', initializeUI);

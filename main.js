import { apiKey } from './config/environment.js'; // Certifique-se de que o caminho está correto

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiAutocompleteUrl = 'https://api.teleport.org/api/cities/?search='; // Usando Teleport API para autocomplete

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado e analisado'); // Log para depuração

    async function getWeatherData(city, state = '') {
        try {
            let query = city;
            if (state) {
                query = `${city},${state}`;
            }
            query = query.replace(/\s+/g, '%20');
            console.log('Query para API:', query); // Log para depuração
            const response = await fetch(`${apiUrl}?q=${query}&appid=${apiKey}&units=metric&lang=pt_br`);
            if (!response.ok) {
                if (state) {
                    console.log('Primeira tentativa falhou, tentando apenas com a cidade.');
                    return await getWeatherData(city); // Tenta novamente apenas com a cidade
                }
                throw new Error('Cidade não encontrada');
            }
            const data = await response.json();
            console.log('Dados recebidos:', data); // Log para depuração
            displayWeatherData(data);
        } catch (error) {
            console.error('Erro ao buscar os dados do clima:', error);
            displayError(error.message);
            setTimeout(() => {
                document.querySelector('.weather_info').innerHTML = ''; // Limpar mensagem de erro após 5 segundos
            }, 5000); 
        }
    }

    async function getWeatherDataByCoords(lat, lon) {
        try {
            console.log('Buscando dados para as coordenadas:', lat, lon); // Log para depuração
            const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`);
            if (!response.ok) {
                throw new Error('Localização não encontrada');
            }
            const data = await response.json();
            console.log('Dados recebidos:', data); // Log para depuração
            displayWeatherData(data, true);
        } catch (error) {
            console.error('Erro ao buscar os dados do clima por coordenadas:', error);
            displayError(error.message);
            setTimeout(() => {
                document.querySelector('.weather_info').innerHTML = ''; // Limpar mensagem de erro após 5 segundos
            }, 5000); 
        }
    }

    function displayWeatherData(data, isCurrentLocation = false) {
        console.log('Exibindo dados na UI'); // Log para depuração

        const weatherImage = document.getElementById('weatherImage');
        const temperature = document.getElementById('temperature');
        const weatherStatus = document.getElementById('weatherStatus');
        const cityName = document.getElementById('cityName');
        const feelsLike = document.getElementById('feelsLike');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('windSpeed');
        const dateTime = document.getElementById('dateTime');

        if (weatherImage && temperature && weatherStatus && cityName && feelsLike && humidity && windSpeed && dateTime) {
            const weatherDescription = data.weather[0].description;
            const weatherMain = data.weather[0].main.toLowerCase();
            const weatherIconMap = {
                clear: 'clear.png',
                clouds: 'cloud.png',
                rain: 'rain.png',
                mist: 'mist.png',
                snow: 'snow.png'
            };

            const timezoneOffset = data.timezone; // Offset em segundos
            const localDateTime = luxon.DateTime.now().setZone('UTC').plus({ seconds: timezoneOffset }).toFormat('dd/MM/yyyy HH:mm');

            weatherImage.src = `./img/${weatherIconMap[weatherMain] || 'clear.png'}`;
            temperature.textContent = `${Math.round(data.main.temp)} °C`;
            weatherStatus.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
            cityName.textContent = isCurrentLocation ? 'Sua localização atual' : `${data.name}, ${data.sys.country}`;
            feelsLike.textContent = `Sensação Térmica: ${Math.round(data.main.feels_like)} °C`;
            humidity.textContent = `Umidade: ${data.main.humidity}%`;
            windSpeed.textContent = `Velocidade do Vento: ${data.wind.speed} m/s`;
            dateTime.textContent = localDateTime;
        } else {
            console.error('Um ou mais elementos não foram encontrados no DOM'); // Log para depuração
        }
    }

    function displayError(message) {
        console.log('Exibindo erro na UI'); // Log para depuração
        const weatherContainer = document.querySelector('.weather_info');
        if (weatherContainer) {
            weatherContainer.innerHTML = `<p class="error">${message}</p>`;
        } else {
            console.error('Elemento weather_info não encontrado'); // Log para depuração
        }
    }

    async function getCitySuggestions(query) {
        try {
            const response = await fetch(`${apiAutocompleteUrl}${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar sugestões');
            }
            const data = await response.json();
            return data._embedded['city:search-results'].map(result => result.matching_full_name);
        } catch (error) {
            console.error('Erro ao buscar sugestões de cidade:', error);
            return [];
        }
    }

    function showCitySuggestions(suggestions) {
        const datalist = document.getElementById('citySuggestions');
        if (datalist) {
            datalist.innerHTML = '';
            suggestions.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                datalist.appendChild(option);
            });
        } else {
            console.error('Elemento citySuggestions não encontrado'); // Log para depuração
        }
    }

    const searchButton = document.getElementById('search');
    const locationInput = document.getElementById('location');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const location = locationInput.value;
            console.log('Botão de pesquisa clicado'); // Log para depuração
            if (location) {
                const [city, state] = location.split(',').map(part => part.trim());
                getWeatherData(city, state);
            } else {
                displayError('Por favor, insira o nome de uma cidade.');
            }
        });
    } else {
        console.error('Botão de pesquisa não encontrado'); // Log para depuração
    }

    if (locationInput) {
        locationInput.addEventListener('keyup', async (event) => {
            if (event.key === 'Enter') {
                const location = locationInput.value;
                if (location) {
                    const [city, state] = location.split(',').map(part => part.trim());
                    getWeatherData(city, state);
                } else {
                    displayError('Por favor, insira o nome de uma cidade.');
                }
            } else {
                const query = locationInput.value;
                if (query.length > 2) { // Só buscar sugestões se o usuário digitou mais de 2 caracteres
                    const suggestions = await getCitySuggestions(query);
                    showCitySuggestions(suggestions);
                }
            }
        });
    } else {
        console.error('Campo de entrada location não encontrado'); // Log para depuração
    }

    // Adicionar funcionalidade de localização automática
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherDataByCoords(lat, lon);
        }, (error) => {
            console.error('Erro ao obter a localização do usuário:', error);
            displayError('Não foi possível obter a localização. Por favor, insira o nome da cidade.');
            setTimeout(() => {
                document.querySelector('.weather_info').innerHTML = ''; // Limpar mensagem de erro após 5 segundos
            }, 5000); 
        });
    } else {
        console.error('Geolocalização não é suportada pelo navegador'); // Log para depuração
        displayError('Geolocalização não é suportada pelo navegador. Por favor, insira o nome da cidade.');
        setTimeout(() => {
            document.querySelector('.weather_info').innerHTML = ''; // Limpar mensagem de erro após 5 segundos
        }, 5000); 
    }
});

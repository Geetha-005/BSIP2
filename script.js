// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const refreshBtn = document.getElementById('refresh-btn');
const weatherContainer = document.getElementById('weather-container');
const loadingContainer = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

// Weather display elements
const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const weatherCondition = document.getElementById('weather-condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

// API key (in a real application, you would secure this)
const API_KEY = '452d1b0b1428feb5339a9e7b8c8a20d7'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Last searched city
let lastSearchedCity = '';

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        showError('Please enter a city name');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

refreshBtn.addEventListener('click', () => {
    if (lastSearchedCity) {
        getWeatherData(lastSearchedCity);
    }
});

// Function to get weather data
async function getWeatherData(city) {
    try {
        // Show loading
        showLoading();
        
        // Hide any previous errors
        hideError();
        
        // Save the city for refresh functionality
        lastSearchedCity = city;
        
        // Fetch weather data
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        
        // Update UI with weather data
        updateWeatherUI(data);
        
        // Hide loading and show weather container
        hideLoading();
        weatherContainer.style.display = 'block';
        
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    // Update location and date
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    const date = new Date();
    dateTime.textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Update temperature and feels like
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    
    // Update weather condition
    weatherCondition.textContent = data.weather[0].description;
    
    // Update weather details
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Update weather icon
    setWeatherIcon(data.weather[0].id);
}

// Function to set weather icon based on weather condition ID
function setWeatherIcon(weatherId) {
    // Clear previous classes
    weatherIcon.className = '';
    
    // Set icon based on weather condition ID
    // Reference: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) {
        // Thunderstorm
        weatherIcon.className = 'fas fa-bolt';
    } else if (weatherId >= 300 && weatherId < 400) {
        // Drizzle
        weatherIcon.className = 'fas fa-cloud-rain';
    } else if (weatherId >= 500 && weatherId < 600) {
        // Rain
        weatherIcon.className = 'fas fa-umbrella';
    } else if (weatherId >= 600 && weatherId < 700) {
        // Snow
        weatherIcon.className = 'far fa-snowflake';
    } else if (weatherId >= 700 && weatherId < 800) {
        // Atmosphere (fog, mist, etc.)
        weatherIcon.className = 'fas fa-smog';
    } else if (weatherId === 800) {
        // Clear sky
        weatherIcon.className = 'fas fa-sun';
    } else if (weatherId > 800) {
        // Clouds
        weatherIcon.className = 'fas fa-cloud';
    }
}

// Function to show loading state
function showLoading() {
    loadingContainer.style.display = 'flex';
    weatherContainer.style.display = 'none';
}

// Function to hide loading state
function hideLoading() {
    loadingContainer.style.display = 'none';
}

// Function to show error message
function showError(message) {
    errorContainer.style.display = 'block';
    errorMessage.textContent = message;
    weatherContainer.style.display = 'none';
}

// Function to hide error message
function hideError() {
    errorContainer.style.display = 'none';
}
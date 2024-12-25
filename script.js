// -------------------- API Config --------------------
const WEATHER_API_KEY = '9505fd1df737e20152fbd78cdb289b6a'; // Replace with your valid key
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + WEATHER_API_KEY;

// For country info, we'll use the public REST Countries API:
const COUNTRY_URL = 'https://restcountries.com/v3.1/name/'; 
// Note: You can also specify "?fullText=true" if you want an exact match

// -------------------- DOM Elements --------------------
const form = document.querySelector('form');
const searchCountry = document.getElementById('searchCountry');

// Country details
const countryDetailsSection = document.querySelector('.country-details');
const countryFlag = document.getElementById('countryFlag');
const countryName = document.getElementById('countryName');
const countryCapital = document.getElementById('countryCapital');
const countryRegion = document.getElementById('countryRegion');
const countryPopulation = document.getElementById('countryPopulation');
const moreDetailsBtn = document.getElementById('moreDetailsBtn');

// Weather details
const weatherDetailsSection = document.querySelector('.weather-details');
const cityCaption = document.getElementById('cityCaption');
const weatherFlag = document.getElementById('weatherFlag');
const weatherIcon = document.getElementById('weatherIcon');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const cloudsVal = document.getElementById('clouds');
const humidityVal = document.getElementById('humidity');
const pressureVal = document.getElementById('pressure');

// We'll store the capital city from the country data here:
let storedCapital = '';
// We'll also store the country code to display the flag in weather section:
let storedCountryCode = '';

// -------------------- Event Listeners --------------------

// 1) On form submit, fetch country details
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchCountry.value.trim();
  if (query) {
    fetchCountryDetails(query);
  }
});

// 2) On "More Details" button, fetch weather for capital
moreDetailsBtn.addEventListener('click', () => {
  if (storedCapital) {
    fetchWeather(storedCapital, storedCountryCode);
  }
});

// -------------------- Fetch Country --------------------
function fetchCountryDetails(countryName) {
  // Example: https://restcountries.com/v3.1/name/italy
  fetch(COUNTRY_URL + countryName)
    .then(response => response.json())
    .then(data => {
      console.log('Country data:', data);
      if (data.status === 404 || data.message) {
        // handle error if country not found
        alert('Country not found. Please try again.');
        countryDetailsSection.style.display = 'none';
        weatherDetailsSection.style.display = 'none';
      } else {
        // Usually data is an array; take the first item
        const country = data[0];
        displayCountryDetails(country);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error fetching country data');
    });
}

// -------------------- Display Country --------------------
function displayCountryDetails(country) {
  // Show the country-details section
  countryDetailsSection.style.display = 'block';
  weatherDetailsSection.style.display = 'none'; // Hide old weather info if any

  // Extract relevant data
  const commonName = country.name?.common || '';
  const officialName = country.name?.official || commonName; 
  const capital = country.capital ? country.capital[0] : 'N/A';
  const region = country.region || 'N/A';
  const population = country.population ? country.population.toLocaleString() : 'N/A';
  const flagSrc = country.flags?.png || '';

  // Fill the UI
  countryFlag.src = flagSrc;
  countryName.textContent = officialName;
  countryCapital.textContent = capital;
  countryRegion.textContent = region;
  countryPopulation.textContent = population;

  // Store the capital and country code for the weather
  storedCapital = capital;
  storedCountryCode = country.cca2 || ''; // 2-letter country code if you want

  // Clear the search box
  searchCountry.value = '';
}

// -------------------- Fetch Weather --------------------
function fetchWeather(cityName, countryCode) {
  // Example: https://api.openweathermap.org/data/2.5/weather?units=metric&appid=KEY&q=Rome
  const url = WEATHER_URL + '&q=' + encodeURIComponent(cityName);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Weather data:', data);
      if (data.cod === 200) {
        displayWeather(data, countryCode);
      } else {
        alert('Weather not found for this city.');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error fetching weather data');
    });
}

// -------------------- Display Weather --------------------
function displayWeather(data, countryCode) {
  // Show weather-details section
  weatherDetailsSection.style.display = 'block';

  // Basic info
  cityCaption.textContent = data.name;
  // If you want the country's flag in the weather info, do something like:
  weatherFlag.src = countryCode
    ? `https://flagsapi.com/${countryCode}/shiny/32.png`
    : '';

  // Weather icon
  const icon = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Temperature
  weatherTemp.textContent = data.main.temp.toFixed(1); // 1 decimal
  weatherDesc.textContent = data.weather[0].description;

  // Clouds, humidity, pressure
  cloudsVal.textContent = data.clouds.all;
  humidityVal.textContent = data.main.humidity;
  pressureVal.textContent = data.main.pressure;
}

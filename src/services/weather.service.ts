/*
  weather.service.ts

  Purpose:
  Handles communication between the weather application and the
  OpenWeather API. It provides functions for searching locations,
  retrieving current weather conditions, and retrieving forecast data.
  The API key is loaded securely from the project's environment variables.
*/

import type { CurrentWeatherResponse, ForecastResponse, GeoLocation } from '@/types/weather'

// Retrieves the OpenWeather API key from the project's environment variables.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// Base URL used for current weather and forecast API requests.
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Base URL used for OpenWeather's geocoding/location search API.
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0'

// Checks that an OpenWeather API key is available before
// attempting to make any API requests.
function ensureApiKey(): void {
  if (!API_KEY) {
    throw new Error(
      'OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY to your .env file.',
    )
  }
}

// Searches OpenWeather's geocoding API for locations matching
// the city or airport entered by the user.
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  ensureApiKey()

  // Sends the search query to the geocoding API.
  // encodeURIComponent safely prepares the user's search text for the URL.
  // The results are limited to a maximum of five matching locations.
  const response = await fetch(
    `${GEO_BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
  )

  // Throws an error if the location search request is unsuccessful.
  if (!response.ok) {
    throw new Error('Unable to search for locations.')
  }

  // Converts the JSON response into the GeoLocation structure
  // used throughout the application.
  return (await response.json()) as GeoLocation[]
}

// Retrieves the current weather conditions for a location
// using its latitude and longitude.
export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeatherResponse> {
  ensureApiKey()

  // Requests current weather data using the selected coordinates.
  // units=metric tells OpenWeather to return temperatures in Celsius.
  const response = await fetch(
    `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  )

  // Throws an error if current weather data cannot be retrieved.
  if (!response.ok) {
    throw new Error('Unable to load current weather.')
  }

  // Converts the API JSON response into the CurrentWeatherResponse
  // structure used by the application.
  return (await response.json()) as CurrentWeatherResponse
}

// Retrieves forecast information for a location
// using its latitude and longitude.
export async function getForecast(lat: number, lon: number): Promise<ForecastResponse> {
  ensureApiKey()

  // Requests forecast data for the selected coordinates.
  // Metric units are used so temperatures are returned in Celsius.
  const response = await fetch(
    `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  )

  // Throws an error if the forecast request is unsuccessful.
  if (!response.ok) {
    throw new Error('Unable to load weather forecast.')
  }

  // Converts the API JSON response into the ForecastResponse
  // structure expected by the rest of the application.
  return (await response.json()) as ForecastResponse
}

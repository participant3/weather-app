import type { CurrentWeatherResponse, ForecastResponse, GeoLocation } from '@/types/weather'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0'

function ensureApiKey(): void {
  if (!API_KEY) {
    throw new Error(
      'OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY to your .env file.',
    )
  }
}

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  ensureApiKey()

  const response = await fetch(
    `${GEO_BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
  )

  if (!response.ok) {
    throw new Error('Unable to search for locations.')
  }

  return (await response.json()) as GeoLocation[]
}

export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeatherResponse> {
  ensureApiKey()

  const response = await fetch(
    `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  )

  if (!response.ok) {
    throw new Error('Unable to load current weather.')
  }

  return (await response.json()) as CurrentWeatherResponse
}

export async function getForecast(lat: number, lon: number): Promise<ForecastResponse> {
  ensureApiKey()

  const response = await fetch(
    `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  )

  if (!response.ok) {
    throw new Error('Unable to load weather forecast.')
  }

  return (await response.json()) as ForecastResponse
}

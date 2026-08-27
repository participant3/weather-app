/*
  weather.ts

  Purpose:
  Defines the TypeScript interfaces used for weather and location data
  throughout the application. These interfaces describe data returned
  by the OpenWeather API as well as data created and stored by the app.
*/

// Represents the weather information displayed on each
// location card on the application's home page.
export interface WeatherLocation {
  id: number
  city: string
  subtitle: string
  temperature: number
  high: number
  low: number
  description: string
  weatherIcon: string
  backgroundImage: string
  lat: number
  lon: number

  // Identifies whether this card represents the application's
  // default "My Location".
  isDefaultLocation?: boolean
}

// Represents a location returned by the OpenWeather
// Geocoding API when the user performs a search.
export interface GeoLocation {
  name: string

  // Contains alternative/localised names when provided by the API.
  local_names?: Record<string, string>

  lat: number
  lon: number
  country: string

  // State is optional because it is not provided for every location.
  state?: string
}

// Represents an individual weather condition returned by OpenWeather,
// including its description and corresponding weather icon.
export interface OpenWeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

// Defines the structure of the current-weather response
// received from the OpenWeather API.
export interface CurrentWeatherResponse {
  // Coordinates of the requested location.
  coord: {
    lon: number
    lat: number
  }

  // Current weather condition information.
  weather: OpenWeatherCondition[]

  // Main temperature and atmospheric measurements.
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }

  visibility: number

  // Current wind information.
  wind: {
    speed: number
    deg: number
  }

  // Time when the weather data was calculated,
  // represented as a Unix timestamp.
  dt: number

  // Country and sunrise/sunset information for the location.
  sys: {
    country: string
    sunrise: number
    sunset: number
  }

  // Timezone offset for the selected location.
  timezone: number

  id: number
  name: string
}

// Represents one forecast period returned by
// the OpenWeather forecast API.
export interface ForecastItem {
  // Unix timestamp for this forecast period.
  dt: number

  // Temperature and atmospheric measurements
  // predicted for this forecast period.
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }

  weather: OpenWeatherCondition[]

  // Forecast wind information.
  wind: {
    speed: number
    deg: number
  }

  visibility: number

  // Human-readable date and time supplied by the API.
  dt_txt: string
}

// Represents a location saved by the user.
// These locations are persisted using localStorage.
export interface SavedWeatherLocation {
  id: string
  name: string
  country: string
  state?: string
  lat: number
  lon: number

  // Identifies Bangsar South as the default "My Location".
  isDefaultLocation?: boolean
}

// Defines the complete forecast response returned
// by the OpenWeather forecast API.
export interface ForecastResponse {
  // Contains the individual forecast periods.
  list: ForecastItem[]

  // Contains information about the city associated
  // with the forecast.
  city: {
    id: number
    name: string
    country: string
    timezone: number
    sunrise: number
    sunset: number

    // Coordinates of the forecast location.
    coord: {
      lat: number
      lon: number
    }
  }
}

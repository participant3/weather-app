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
  isCurrentLocation?: boolean
}

export interface GeoLocation {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface OpenWeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeatherResponse {
  coord: {
    lon: number
    lat: number
  }

  weather: OpenWeatherCondition[]

  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }

  visibility: number

  wind: {
    speed: number
    deg: number
  }

  dt: number

  sys: {
    country: string
    sunrise: number
    sunset: number
  }

  timezone: number
  id: number
  name: string
}

export interface ForecastItem {
  dt: number

  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }

  weather: OpenWeatherCondition[]

  wind: {
    speed: number
    deg: number
  }

  visibility: number
  dt_txt: string
}

export interface SavedWeatherLocation {
  id: string
  name: string
  country: string
  state?: string
  lat: number
  lon: number
  isCurrentLocation?: boolean
}

export interface ForecastResponse {
  list: ForecastItem[]

  city: {
    id: number
    name: string
    country: string
    timezone: number
    sunrise: number
    sunset: number

    coord: {
      lat: number
      lon: number
    }
  }
}

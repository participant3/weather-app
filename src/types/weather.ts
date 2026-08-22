export interface WeatherLocation {
  id: number
  city: string
  subtitle: string
  temperature: number
  high: number
  low: number
  description: string
  backgroundImage: string
  isCurrentLocation?: boolean
}

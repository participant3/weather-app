import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getCurrentWeather, getForecast, searchLocations } from '@/services/weather.service'

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeoLocation,
  SavedWeatherLocation,
} from '@/types/weather'

export const useWeatherStore = defineStore('weather', () => {
  const searchResults = ref<GeoLocation[]>([])
  const currentWeather = ref<CurrentWeatherResponse | null>(null)
  const forecast = ref<ForecastResponse | null>(null)

  const isSearching = ref(false)
  const isLoadingWeather = ref(false)

  const searchError = ref<string | null>(null)
  const weatherError = ref<string | null>(null)

  const hasSearchResults = computed(() => searchResults.value.length > 0)
  const savedLocations = ref<SavedWeatherLocation[]>([])

  async function searchCity(query: string): Promise<void> {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      searchResults.value = []
      searchError.value = 'Please enter a city or airport.'
      return
    }

    isSearching.value = true
    searchError.value = null

    try {
      searchResults.value = await searchLocations(trimmedQuery)

      if (searchResults.value.length === 0) {
        searchError.value = 'No matching locations found.'
      }
    } catch (error) {
      searchResults.value = []
      searchError.value = error instanceof Error ? error.message : 'Unable to search for locations.'
    } finally {
      isSearching.value = false
    }
  }

  async function loadWeather(lat: number, lon: number): Promise<void> {
    isLoadingWeather.value = true
    weatherError.value = null

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon),
      ])

      currentWeather.value = weatherData
      forecast.value = forecastData
    } catch (error) {
      weatherError.value = error instanceof Error ? error.message : 'Unable to load weather.'
    } finally {
      isLoadingWeather.value = false
    }
  }

  function clearSearch(): void {
    searchResults.value = []
    searchError.value = null
  }

  function loadSavedLocations(): void {
    const stored = localStorage.getItem('saved-weather-locations')

    if (!stored) {
      return
    }

    try {
      savedLocations.value = JSON.parse(stored) as SavedWeatherLocation[]
    } catch {
      savedLocations.value = []
    }
  }

  function saveLocations(): void {
    localStorage.setItem('saved-weather-locations', JSON.stringify(savedLocations.value))
  }

  function addSavedLocation(location: GeoLocation): void {
    const alreadyExists = savedLocations.value.some(
      (saved) => saved.lat === location.lat && saved.lon === location.lon,
    )

    if (alreadyExists) {
      return
    }

    savedLocations.value.push({
      id: `${location.lat}-${location.lon}`,
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
    })

    saveLocations()
  }

  function setCurrentLocation(lat: number, lon: number): void {
    const existingIndex = savedLocations.value.findIndex((location) => location.isCurrentLocation)

    const currentLocation: SavedWeatherLocation = {
      id: 'current-location',
      name: 'My Location',
      country: '',
      lat,
      lon,
      isCurrentLocation: true,
    }

    if (existingIndex >= 0) {
      savedLocations.value[existingIndex] = currentLocation
    } else {
      savedLocations.value.unshift(currentLocation)
    }

    saveLocations()
  }

  function removeSavedLocation(lat: number, lon: number): void {
    savedLocations.value = savedLocations.value.filter(
      (location) => location.lat !== lat || location.lon !== lon,
    )

    saveLocations()
  }

  return {
    savedLocations,
    searchResults,
    currentWeather,
    forecast,

    isSearching,
    isLoadingWeather,

    searchError,
    weatherError,

    hasSearchResults,

    searchCity,
    loadWeather,
    clearSearch,

    loadSavedLocations,
    addSavedLocation,
    removeSavedLocation,
    setCurrentLocation,
  }
})

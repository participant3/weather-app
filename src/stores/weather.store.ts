import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getCurrentWeather, getForecast, searchLocations } from '@/services/weather.service'

import type { CurrentWeatherResponse, ForecastResponse, GeoLocation } from '@/types/weather'

export const useWeatherStore = defineStore('weather', () => {
  const searchResults = ref<GeoLocation[]>([])
  const currentWeather = ref<CurrentWeatherResponse | null>(null)
  const forecast = ref<ForecastResponse | null>(null)

  const isSearching = ref(false)
  const isLoadingWeather = ref(false)

  const searchError = ref<string | null>(null)
  const weatherError = ref<string | null>(null)

  const hasSearchResults = computed(() => searchResults.value.length > 0)

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

  return {
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
  }
})

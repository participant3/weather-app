/*
  weather.store.ts

  Purpose:
  Provides the central Pinia store for managing weather-related state
  throughout the application. It manages location searches, current weather,
  forecast data, saved locations, loading states, and error messages.

  Saved locations are persisted using localStorage so they remain available
  when the user refreshes or reopens the application.
*/

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getCurrentWeather, getForecast, searchLocations } from '@/services/weather.service'

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeoLocation,
  SavedWeatherLocation,
} from '@/types/weather'

// Defines Bangsar South as the application's permanent default location.
// This location appears as "My Location" on the home page.
const DEFAULT_LOCATION: SavedWeatherLocation = {
  id: 'default-location',
  name: 'Bangsar South',
  country: 'MY',
  state: 'Kuala Lumpur',
  lat: 3.1106,
  lon: 101.6661,
  isDefaultLocation: true,
}

// Creates the central Pinia store used for weather-related state and actions.
export const useWeatherStore = defineStore('weather', () => {
  // Stores locations returned from the user's search.
  const searchResults = ref<GeoLocation[]>([])

  // Stores the current weather information for the selected location.
  const currentWeather = ref<CurrentWeatherResponse | null>(null)

  // Stores forecast information for the selected location.
  const forecast = ref<ForecastResponse | null>(null)

  // Stores locations that have been saved by the user.
  const savedLocations = ref<SavedWeatherLocation[]>([])

  // Tracks whether a location search is currently in progress.
  const isSearching = ref(false)

  // Tracks whether weather information is currently being loaded.
  const isLoadingWeather = ref(false)

  // Stores any error produced while searching for a location.
  const searchError = ref<string | null>(null)

  // Stores any error produced while retrieving weather information.
  const weatherError = ref<string | null>(null)

  // Indicates whether the current search returned at least one result.
  const hasSearchResults = computed(() => searchResults.value.length > 0)

  // Searches for locations based on the city or airport
  // entered by the user.
  async function searchCity(query: string): Promise<void> {
    const trimmedQuery = query.trim()

    // Prevents an empty search from being sent to the API.
    if (!trimmedQuery) {
      searchResults.value = []
      searchError.value = 'Please enter a city or airport.'

      return
    }

    isSearching.value = true
    searchError.value = null

    try {
      // Calls the weather service to retrieve matching locations.
      searchResults.value = await searchLocations(trimmedQuery)

      // Displays an error if the API returns no matching locations.
      if (searchResults.value.length === 0) {
        searchError.value = 'No matching locations found.'
      }
    } catch (error) {
      searchResults.value = []

      searchError.value = error instanceof Error ? error.message : 'Unable to search for locations.'
    } finally {
      // Ensures the loading state is stopped whether
      // the request succeeds or fails.
      isSearching.value = false
    }
  }

  // Loads both the current weather and forecast
  // for a location using its coordinates.
  async function loadWeather(lat: number, lon: number): Promise<void> {
    isLoadingWeather.value = true
    weatherError.value = null

    try {
      // Requests current weather and forecast data at the same time
      // instead of waiting for one request to finish before starting the other.
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

  // Removes the current search results and search error.
  function clearSearch(): void {
    searchResults.value = []
    searchError.value = null
  }

  // Loads previously saved weather locations from localStorage.
  function loadSavedLocations(): void {
    const saved = localStorage.getItem('saved-weather-locations')

    if (saved) {
      try {
        // Converts the stored JSON string back into an array
        // of saved weather locations.
        savedLocations.value = JSON.parse(saved) as SavedWeatherLocation[]
      } catch {
        // Uses an empty list if the stored data cannot be parsed.
        savedLocations.value = []
      }
    }

    // Makes sure Bangsar South is included as the default location.
    ensureDefaultLocation()
  }

  // Ensures the default Bangsar South location exists in the saved list.
  function ensureDefaultLocation(): void {
    const hasDefaultLocation = savedLocations.value.some(
      (location) => location.id === DEFAULT_LOCATION.id,
    )

    // Stops if the default location already exists.
    if (hasDefaultLocation) {
      return
    }

    // Adds the default location to the beginning of the saved locations.
    savedLocations.value.unshift(DEFAULT_LOCATION)

    saveLocations()
  }

  // Saves the current list of weather locations to localStorage.
  function saveLocations(): void {
    localStorage.setItem('saved-weather-locations', JSON.stringify(savedLocations.value))
  }

  // Adds a location selected from the search results
  // to the user's saved locations.
  function addSavedLocation(location: GeoLocation): void {
    // Checks the coordinates to prevent the same location
    // from being saved more than once.
    const alreadyExists = savedLocations.value.some(
      (saved) => saved.lat === location.lat && saved.lon === location.lon,
    )

    if (alreadyExists) {
      return
    }

    // Converts the selected GeoLocation into a saved location.
    savedLocations.value.push({
      id: `${location.lat}-${location.lon}`,
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
    })

    // Persists the updated list in localStorage.
    saveLocations()
  }

  // Removes a saved location by matching its latitude and longitude.
  function removeSavedLocation(lat: number, lon: number): void {
    savedLocations.value = savedLocations.value.filter(
      (location) => location.lat !== lat || location.lon !== lon,
    )

    // Saves the updated location list after the location is removed.
    saveLocations()
  }

  // Makes the required state, computed properties, and functions
  // available to components that use this Pinia store.
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
    saveLocations,
    addSavedLocation,
    removeSavedLocation,
  }
})

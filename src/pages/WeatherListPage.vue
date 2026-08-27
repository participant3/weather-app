<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'

import { getCurrentWeather } from '@/services/weather.service'

import SearchBar from '@/components/molecules/SearchBar.vue'
import SearchResultsList from '@/components/organisms/SearchResultsList.vue'
import WeatherLocationList from '@/components/organisms/WeatherLocationList.vue'

import { useWeatherStore } from '@/stores/weather.store'

import type { GeoLocation, WeatherLocation, SavedWeatherLocation } from '@/types/weather'

const router = useRouter()
const weatherStore = useWeatherStore()

const weatherCards = ref<WeatherLocation[]>([])

const { searchResults, isSearching, searchError } = storeToRefs(weatherStore)

const searchQuery = ref('')

/*
 * Default location shown as "My Location".
 *
 * This is a predefined location and does NOT use
 * the browser Geolocation API.
 */
const DEFAULT_LOCATION: SavedWeatherLocation = {
  id: 'default-location',
  name: 'Bangsar South',
  country: 'MY',
  state: 'Kuala Lumpur',
  lat: 3.1106,
  lon: 101.6661,
  isDefaultLocation: true,
}

/*
 * When the page first loads:
 *
 * 1. Load locations previously saved in localStorage.
 * 2. Make sure Bangsar South exists as the default location.
 * 3. Fetch current weather for every saved location.
 */
onMounted(async () => {
  weatherStore.loadSavedLocations()

  ensureDefaultLocation()

  await loadSavedWeatherCards()
})

/*
 * Adds Bangsar South if it does not already exist.
 */
function ensureDefaultLocation(): void {
  const hasDefaultLocation = weatherStore.savedLocations.some(
    (location) => location.id === DEFAULT_LOCATION.id,
  )

  if (hasDefaultLocation) {
    return
  }

  weatherStore.savedLocations.unshift(DEFAULT_LOCATION)

  weatherStore.saveLocations()
}

/*
 * Search for a city using the Pinia weather store.
 */
async function handleSearch(): Promise<void> {
  await weatherStore.searchCity(searchQuery.value)
}

/*
 * When a user chooses a search result:
 *
 * 1. Save the location.
 * 2. Clear the search results.
 * 3. Navigate to its weather detail page.
 */
async function handleSelectLocation(location: GeoLocation): Promise<void> {
  weatherStore.addSavedLocation(location)

  weatherStore.clearSearch()

  await router.push({
    name: 'weather-detail',

    params: {
      lat: location.lat,
      lon: location.lon,
    },
  })
}

/*
 * Convert saved locations into weather cards.
 *
 * Only the location coordinates are saved permanently.
 * Current weather is fetched from OpenWeather whenever
 * the page loads.
 */
async function loadSavedWeatherCards(): Promise<void> {
  weatherCards.value = []

  for (const location of weatherStore.savedLocations) {
    try {
      const weather = await getCurrentWeather(location.lat, location.lon)

      weatherCards.value.push({
        id: weather.id,

        city: weather.name,

        /*
         * The default card title is handled by
         * WeatherLocationCard using isDefaultLocation.
         *
         * Here we display the real location underneath.
         */
        subtitle: location.isDefaultLocation
          ? `${location.name}, ${location.state ?? location.country}`
          : location.state
            ? `${location.state}, ${location.country}`
            : location.country,

        temperature: Math.round(weather.main.temp),

        high: Math.round(weather.main.temp_max),

        low: Math.round(weather.main.temp_min),

        description: weather.weather[0]?.description ?? 'Weather unavailable',

        weatherIcon: weather.weather[0]?.icon ?? '03d',

        backgroundImage: '',

        lat: location.lat,
        lon: location.lon,

        isDefaultLocation: location.isDefaultLocation,
      })
    } catch (error) {
      console.error(`Unable to load weather for ${location.name}`, error)
    }
  }
}
</script>

<template>
  <main class="weather-page">
    <div class="weather-page__container">
      <header class="weather-page__header">
        <h1>Weather</h1>

        <RouterLink class="weather-page__profile" to="/profile" aria-label="Open profile">
          👤
        </RouterLink>
      </header>

      <SearchBar v-model="searchQuery" :is-loading="isSearching" @submit="handleSearch" />

      <p v-if="searchError" class="weather-page__error" role="alert">
        {{ searchError }}
      </p>

      <SearchResultsList :results="searchResults" @select="handleSelectLocation" />

      <WeatherLocationList :locations="weatherCards" />
    </div>
  </main>
</template>

<style scoped lang="scss">
.weather-page {
  min-height: 100vh;

  padding: 24px 16px 48px;

  background: var(--color-background);

  &__container {
    width: 100%;
    max-width: 680px;

    margin: 0 auto;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: var(--spacing-lg);

    h1 {
      margin: 0;

      color: var(--color-primary);

      font-size: 34px;
      font-weight: 700;
    }
  }

  &__profile {
    display: grid;

    width: 42px;
    height: 42px;

    place-items: center;

    border-radius: 50%;

    background: #e4e7ec;

    text-decoration: none;

    transition:
      transform 0.2s ease,
      background 0.2s ease;

    &:hover {
      background: #d7dae0;

      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 3px solid rgba(63, 114, 168, 0.35);

      outline-offset: 3px;
    }
  }

  &__error {
    margin: 10px 0 0;

    color: #b42318;

    font-size: 14px;
  }

  :deep(.search-bar) {
    margin-bottom: 10px;
  }

  :deep(.search-results) {
    margin-bottom: var(--spacing-lg);
  }
}

@media (min-width: 768px) {
  .weather-page {
    padding-top: 48px;
  }
}
</style>

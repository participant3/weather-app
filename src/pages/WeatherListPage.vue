<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCurrentWeather } from '@/services/weather.service'
import { storeToRefs } from 'pinia'
import { useRouter, RouterLink } from 'vue-router'
import { useGeolocation } from '@/composables/useGeolocation'

import SearchBar from '@/components/molecules/SearchBar.vue'
import SearchResultsList from '@/components/organisms/SearchResultsList.vue'
import WeatherLocationList from '@/components/organisms/WeatherLocationList.vue'

import { useWeatherStore } from '@/stores/weather.store'
import type { GeoLocation, WeatherLocation } from '@/types/weather'

const router = useRouter()
const weatherStore = useWeatherStore()
const weatherCards = ref<WeatherLocation[]>([])
const { getCurrentPosition } = useGeolocation()
const isLoadingLocation = ref(false)
const locationError = ref<string | null>(null)

const { searchResults, isSearching, searchError } = storeToRefs(weatherStore)

const searchQuery = ref('')

onMounted(async () => {
  weatherStore.loadSavedLocations()
  await loadSavedWeatherCards()

  const hasCurrentLocation = weatherStore.savedLocations.some(
    (location) => location.isCurrentLocation,
  )
  if (!hasCurrentLocation) {
    await loadMyLocation()
  }
})

async function loadMyLocation(): Promise<void> {
  isLoadingLocation.value = true
  locationError.value = null

  try {
    const coordinates = await getCurrentPosition()

    weatherStore.setCurrentLocation(coordinates.lat, coordinates.lon)

    await loadSavedWeatherCards()
  } catch (error) {
    locationError.value =
      error instanceof Error ? error.message : 'Unable to retrieve your location.'
  } finally {
    isLoadingLocation.value = false
  }
}

async function handleSearch(): Promise<void> {
  await weatherStore.searchCity(searchQuery.value)
}

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

async function loadSavedWeatherCards(): Promise<void> {
  weatherCards.value = []

  for (const location of weatherStore.savedLocations) {
    try {
      const weather = await getCurrentWeather(location.lat, location.lon)

      weatherCards.value.push({
        id: weather.id,
        city: weather.name,
        subtitle: location.isCurrentLocation
          ? 'My Location'
          : location.state
            ? `${location.state}, ${location.country}`
            : location.country,
        temperature: Math.round(weather.main.temp),
        high: Math.round(weather.main.temp_max),
        low: Math.round(weather.main.temp_min),
        description: weather.weather[0]?.description ?? 'Weather unavailable',
        weatherIcon: weather.weather[0]?.icon ?? '03d',
        backgroundImage: '',
        isCurrentLocation: location.isCurrentLocation,
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

      <button
        class="weather-page__location-button"
        type="button"
        :disabled="isLoadingLocation"
        @click="loadMyLocation"
      >
        {{ isLoadingLocation ? 'Finding location...' : 'Use My Location' }}
      </button>

      <p v-if="locationError" class="weather-page__error" role="alert">
        {{ locationError }}
      </p>

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
  }

  &__location-button {
    margin: 10px 0 18px;
    padding: 10px 14px;

    border: none;
    border-radius: 10px;

    background: #eef2ff;
    color: var(--color-primary);

    font-weight: 600;
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

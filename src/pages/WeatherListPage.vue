<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, RouterLink } from 'vue-router'

import SearchBar from '@/components/molecules/SearchBar.vue'
import SearchResultsList from '@/components/organisms/SearchResultsList.vue'
import WeatherLocationList from '@/components/organisms/WeatherLocationList.vue'

import { useWeatherStore } from '@/stores/weather.store'
import type { GeoLocation, WeatherLocation } from '@/types/weather'

const router = useRouter()
const weatherStore = useWeatherStore()

const { searchResults, isSearching, searchError } = storeToRefs(weatherStore)

const searchQuery = ref('')

const locations: WeatherLocation[] = [
  {
    id: 1,
    city: 'Bangsar South',
    subtitle: 'Bangsar South',
    temperature: 24,
    high: 30,
    low: 25,
    description: 'Moderate Rain',
    backgroundImage: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721',
    isCurrentLocation: true,
  },
]

async function handleSearch(): Promise<void> {
  await weatherStore.searchCity(searchQuery.value)
}

async function handleSelectLocation(location: GeoLocation): Promise<void> {
  weatherStore.clearSearch()

  await router.push({
    name: 'weather-detail',
    params: {
      lat: location.lat,
      lon: location.lon,
    },
  })
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

      <WeatherLocationList :locations="locations" />
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

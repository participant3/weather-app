<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import SearchBar from '@/components/molecules/SearchBar.vue'
import WeatherLocationList from '@/components/organisms/WeatherLocationList.vue'

import type { WeatherLocation } from '@/types/weather'

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
  {
    id: 2,
    city: 'London',
    subtitle: '10:30 AM',
    temperature: 9,
    high: 16,
    low: -4,
    description: 'Not as cold tomorrow, with a high of 16°',
    backgroundImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  },
  {
    id: 3,
    city: 'Milan',
    subtitle: '10:30 AM',
    temperature: 18,
    high: 16,
    low: -4,
    description: 'Mostly Cloudy',
    backgroundImage: 'https://images.unsplash.com/photo-1566010503302-2564ae0d47b6',
  },
]
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

      <SearchBar v-model="searchQuery" />

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

  :deep(.search-bar) {
    margin-bottom: var(--spacing-lg);
  }
}

@media (min-width: 768px) {
  .weather-page {
    padding-top: 48px;
  }
}
</style>

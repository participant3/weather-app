<!--
  WeatherLocationList.vue

  Purpose:
  Displays the collection of saved weather locations on the home page.
  It receives an array of weather locations and creates a
  WeatherLocationCard component for each saved location.
-->

<script setup lang="ts">
import WeatherLocationCard from '@/components/molecules/WeatherLocationCard.vue'
import type { WeatherLocation } from '@/types/weather'

// Receives the array of saved weather locations
// that should be displayed on the home page.
defineProps<{
  locations: WeatherLocation[]
}>()
</script>

<template>
  <!--
    Container for all saved weather location cards.
    The aria-label helps identify this section for screen readers.
  -->
  <section class="weather-list" aria-label="Saved weather locations">
    <!--
      Creates one WeatherLocationCard for every saved location.
      The unique location ID is used as the Vue key.
    -->
    <WeatherLocationCard v-for="location in locations" :key="location.id" :location="location" />
  </section>
</template>

<style scoped lang="scss">
.weather-list {
  // Arranges the saved weather cards vertically
  // with consistent spacing between each card.
  display: grid;
  gap: var(--spacing-md);
}
</style>

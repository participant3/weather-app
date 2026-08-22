<script setup lang="ts">
import WeatherLocationCard from '@/components/molecules/WeatherLocationCard.vue'
import type { WeatherLocation } from '@/types/weather'

defineProps<{
  locations: WeatherLocation[]
}>()
</script>

<template>
  <section class="weather-list" aria-label="Saved weather locations">
    <WeatherLocationCard v-for="location in locations" :key="location.id" :location="location" />
  </section>
</template>

<style scoped lang="scss">
.weather-list {
  display: grid;
  gap: var(--spacing-md);
}
</style>

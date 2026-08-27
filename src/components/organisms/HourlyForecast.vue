<!--
  HourlyForecast.vue

  Purpose:
  Displays the 3-hour weather forecast on the weather detail page.
  It receives an array of forecast data and creates an
  HourlyForecastCard component for each forecast period.
-->

<script setup lang="ts">
import HourlyForecastCard from '@/components/molecules/HourlyForecastCard.vue'

// Defines the structure of each forecast period
// contained within the 3-hour forecast data.
interface HourForecast {
  time: string
  temperature: number
  icon: string
}

// Receives the array of forecast information
// from the parent weather detail component.
defineProps<{
  forecast: HourForecast[]
}>()
</script>

<template>
  <!-- Container for the complete 3-hour forecast section. -->
  <section class="hourly">
    <h2>3 - Hour Forecast</h2>

    <!--
      Displays the forecast cards horizontally.
      One HourlyForecastCard is created for every item
      contained within the forecast array.
    -->
    <div class="hourly__list">
      <HourlyForecastCard
        v-for="item in forecast"
        :key="item.time"
        :time="item.time"
        :temperature="item.temperature"
        :icon="item.icon"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hourly {
  // Styles the heading displayed above the hourly forecast.
  h2 {
    margin-bottom: 16px;
    font-size: 20px;
  }

  // Arranges the hourly forecast cards horizontally.
  // Horizontal scrolling is enabled when the cards
  // exceed the available screen width.
  &__list {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
  }
}
</style>

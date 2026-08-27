<!--
  DailyForecast.vue

  Purpose:
  Displays the weekly weather forecast on the weather detail page.
  It receives an array of daily forecast data and creates a
  DailyForecastRow component for each day.
-->

<script setup lang="ts">
import DailyForecastRow from '@/components/molecules/DailyForecastRow.vue'

// Defines the structure of each individual day
// contained within the weekly forecast data.
interface DailyForecastItem {
  day: string
  icon: string
  condition: string
  low: number
  high: number
}

// Receives the complete weekly forecast array from the parent component.
defineProps<{
  forecast: DailyForecastItem[]
}>()
</script>

<template>
  <!-- Container for the complete weekly forecast section. -->
  <section class="daily">
    <h2>Weekly Forecast</h2>

    <!--
      Creates one DailyForecastRow for every day in the forecast array
      and passes that day's weather information to the row component.
    -->
    <DailyForecastRow
      v-for="item in forecast"
      :key="item.day"
      :day="item.day"
      :icon="item.icon"
      :condition="item.condition"
      :low="item.low"
      :high="item.high"
    />
  </section>
</template>

<style scoped lang="scss">
.daily {
  // Styles the heading displayed above the weekly forecast.
  h2 {
    margin: 0 0 18px;

    font-size: 26px;
    font-weight: 700;
  }

  // Arranges the individual daily forecast rows vertically
  // with consistent spacing between them.
  display: grid;
  gap: 14px;
}
</style>

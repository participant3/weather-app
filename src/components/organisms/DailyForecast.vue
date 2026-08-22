<script setup lang="ts">
import DailyForecastRow from '@/components/molecules/DailyForecastRow.vue'

interface DailyForecastItem {
  day: string
  icon: string
  low: number
  high: number
}

defineProps<{
  forecast: DailyForecastItem[]
}>()
</script>

<template>
  <section class="daily">
    <h2>5-Day Forecast</h2>

    <DailyForecastRow
      v-for="item in forecast"
      :key="item.day"
      :day="item.day"
      :icon="item.icon"
      :low="item.low"
      :high="item.high"
    />
  </section>
</template>

<style scoped lang="scss">
.daily {
  h2 {
    margin-bottom: 8px;
    font-size: 20px;
  }
}
</style>

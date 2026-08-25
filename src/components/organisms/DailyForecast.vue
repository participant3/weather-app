<script setup lang="ts">
import DailyForecastRow from '@/components/molecules/DailyForecastRow.vue'

interface DailyForecastItem {
  day: string
  icon: string
  condition: string
  low: number
  high: number
}

defineProps<{
  forecast: DailyForecastItem[]
}>()
</script>

<template>
  <section class="daily">
    <h2>Weekly Forecast</h2>

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
  h2 {
    margin: 0 0 18px;

    font-size: 26px;
    font-weight: 700;
  }

  display: grid;
  gap: 14px;
}
</style>

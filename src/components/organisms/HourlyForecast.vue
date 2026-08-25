<script setup lang="ts">
import HourlyForecastCard from '@/components/molecules/HourlyForecastCard.vue'

interface HourForecast {
  time: string
  temperature: number
  icon: string
}

defineProps<{
  forecast: HourForecast[]
}>()
</script>

<template>
  <section class="hourly">
    <h2>3 - Hour Forecast</h2>

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
  h2 {
    margin-bottom: 16px;
    font-size: 20px;
  }

  &__list {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
  }
}
</style>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import WeatherHero from '@/components/organisms/WeatherHero.vue'
import HourlyForecast from '@/components/organisms/HourlyForecast.vue'
import DailyForecast from '@/components/organisms/DailyForecast.vue'

const hourlyForecast = [
  { time: '7:00 PM', temperature: 20, icon: '🌧️' },
  { time: '8:00 PM', temperature: 20, icon: '🌧️' },
  { time: '9:00 PM', temperature: 19, icon: '☁️' },
  { time: '10:00 PM', temperature: 19, icon: '☁️' },
]

const dailyForecast = [
  { day: 'Today', icon: '🌧️', low: 15, high: 20 },
  { day: 'Monday', icon: '🌦️', low: 13, high: 18 },
  { day: 'Tuesday', icon: '☁️', low: 12, high: 17 },
  { day: 'Wednesday', icon: '🌤️', low: 14, high: 21 },
  { day: 'Thursday', icon: '☀️', low: 16, high: 23 },
]
</script>

<template>
  <main class="detail-page">
    <div class="detail-page__container">
      <RouterLink class="detail-page__back" to="/" aria-label="Back to weather list">
        ←
      </RouterLink>

      <WeatherHero
        city="London"
        date="Sunday, 22 August"
        :temperature="20"
        condition="Moderate Rain"
        updated-at="6:45 PM"
      />

      <div class="detail-page__content">
        <HourlyForecast :forecast="hourlyForecast" />

        <DailyForecast :forecast="dailyForecast" />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  background: #f8fafc;

  &__container {
    position: relative;

    width: 100%;
    max-width: 720px;
    min-height: 100vh;

    margin: 0 auto;

    background: white;
  }

  &__back {
    position: absolute;
    top: 22px;
    left: 22px;
    z-index: 10;

    color: white;

    font-size: 28px;
    text-decoration: none;
  }

  &__content {
    display: grid;
    gap: 36px;

    padding: 28px 20px 48px;
  }
}
</style>

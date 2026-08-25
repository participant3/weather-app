<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouterLink } from 'vue-router'

import WeatherHero from '@/components/organisms/WeatherHero.vue'
import HourlyForecast from '@/components/organisms/HourlyForecast.vue'
import DailyForecast from '@/components/organisms/DailyForecast.vue'

import { useWeatherStore } from '@/stores/weather.store'

const route = useRoute()
const weatherStore = useWeatherStore()

const { currentWeather, forecast, isLoadingWeather, weatherError } = storeToRefs(weatherStore)

const latitude = computed(() => Number(route.params.lat))
const longitude = computed(() => Number(route.params.lon))

onMounted(async () => {
  if (Number.isNaN(latitude.value) || Number.isNaN(longitude.value)) {
    return
  }

  await weatherStore.loadWeather(latitude.value, longitude.value)
})

const hourlyForecast = computed(() => {
  if (!forecast.value) {
    return []
  }

  const timezoneOffset = forecast.value.city.timezone

  return forecast.value.list.slice(0, 6).map((item) => {
    const localDate = new Date((item.dt + timezoneOffset) * 1000)

    const time = localDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    })

    return {
      time,
      temperature: Math.round(item.main.temp),
      icon: item.weather[0]?.icon ?? '03d',
    }
  })
})

const dailyForecast = computed(() => {
  if (!forecast.value) {
    return []
  }

  const timezoneOffset = forecast.value.city.timezone

  const grouped = new Map<
    string,
    {
      day: string
      icon: string
      condition: string
      low: number
      high: number
    }
  >()

  for (const item of forecast.value.list) {
    const localDate = new Date((item.dt + timezoneOffset) * 1000)

    const key = localDate.toISOString().slice(0, 10)

    const day = localDate.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    })

    if (!grouped.has(key)) {
      grouped.set(key, {
        day,
        icon: item.weather[0]?.icon ?? '03d',
        condition: item.weather[0]?.description ?? 'Unknown',
        low: Math.round(item.main.temp_min),
        high: Math.round(item.main.temp_max),
      })
    } else {
      const existing = grouped.get(key)

      if (existing) {
        existing.low = Math.min(existing.low, Math.round(item.main.temp_min))

        existing.high = Math.max(existing.high, Math.round(item.main.temp_max))
      }
    }
  }

  return Array.from(grouped.values()).slice(0, 5)
})
</script>

<template>
  <main class="detail-page">
    <div class="detail-page__container">
      <RouterLink class="detail-page__back" to="/" aria-label="Back to weather list">
        ←
      </RouterLink>

      <p v-if="isLoadingWeather" class="detail-page__status" role="status">Loading weather...</p>

      <p v-else-if="weatherError" class="detail-page__error" role="alert">
        {{ weatherError }}
      </p>

      <template v-else-if="currentWeather">
        <WeatherHero
          :city="currentWeather.name"
          :date="
            new Date(currentWeather.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })
          "
          :temperature="Math.round(currentWeather.main.temp)"
          :condition="currentWeather.weather[0]?.description ?? 'Unknown'"
          :updated-at="
            new Date(currentWeather.dt * 1000).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })
          "
          :weather-icon="currentWeather.weather[0]?.icon ?? '03d'"
        />

        <div class="detail-page__content">
          <HourlyForecast :forecast="hourlyForecast" />

          <DailyForecast :forecast="dailyForecast" />
        </div>
      </template>
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
    line-height: 1;
    text-decoration: none;

    &:hover {
      opacity: 0.8;
    }
  }

  &__content {
    display: grid;
    gap: 36px;

    padding: 28px 20px 48px;
  }

  &__status,
  &__error {
    padding: 100px 20px 40px;

    text-align: center;
  }

  &__error {
    color: #b42318;
  }
}
</style>

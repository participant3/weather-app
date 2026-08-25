<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import WeatherHero from '@/components/organisms/WeatherHero.vue'
import HourlyForecast from '@/components/organisms/HourlyForecast.vue'
import DailyForecast from '@/components/organisms/DailyForecast.vue'

import { useWeatherStore } from '@/stores/weather.store'

const route = useRoute()
const router = useRouter()
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

async function handleRefreshWeather(): Promise<void> {
  await weatherStore.loadWeather(latitude.value, longitude.value)
}

async function handleDeleteLocation(): Promise<void> {
  weatherStore.removeSavedLocation(latitude.value, longitude.value)

  await router.push('/')
}

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

const heroDate = computed(() => {
  if (!currentWeather.value) {
    return ''
  }

  const localDate = new Date((currentWeather.value.dt + currentWeather.value.timezone) * 1000)

  return localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
})

const heroUpdatedTime = computed(() => {
  if (!currentWeather.value) {
    return ''
  }

  const localDate = new Date((currentWeather.value.dt + currentWeather.value.timezone) * 1000)

  return localDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  })
})
</script>

<template>
  <main class="detail-page">
    <div class="detail-page__container">
      <RouterLink class="detail-page__back" to="/" aria-label="Back to weather list">
        ←
      </RouterLink>

      <button
        class="detail-page__delete"
        type="button"
        aria-label="Delete location"
        title="Delete location"
        @click="handleDeleteLocation"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="
              M3 6h18
              M8 6V4h8v2
              M19 6l-1 14H6L5 6
              M10 10v6
              M14 10v6
            "
          />
        </svg>
      </button>

      <p v-if="isLoadingWeather" class="detail-page__status" role="status">Loading weather...</p>

      <p v-else-if="weatherError" class="detail-page__error" role="alert">
        {{ weatherError }}
      </p>

      <template v-else-if="currentWeather">
        <WeatherHero
          :city="currentWeather.name"
          :date="heroDate"
          :temperature="Math.round(currentWeather.main.temp)"
          :condition="currentWeather.weather[0]?.description ?? 'Unknown'"
          :updated-at="heroUpdatedTime"
          :weather-icon="currentWeather.weather[0]?.icon ?? '03d'"
          @refresh="handleRefreshWeather"
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

    display: grid;

    width: 44px;
    height: 44px;

    place-items: center;

    border-radius: 50%;

    color: white;

    font-size: 28px;
    line-height: 1;

    text-decoration: none;

    transition:
      background 0.2s ease,
      transform 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    &:active {
      transform: scale(0.94);
    }

    &:focus-visible {
      outline: 3px solid rgba(255, 255, 255, 0.5);

      outline-offset: 2px;
    }
  }

  &__delete {
    position: absolute;
    top: 22px;
    right: 22px;
    z-index: 10;

    display: grid;

    width: 44px;
    height: 44px;

    padding: 8px;

    place-items: center;

    border: none;
    border-radius: 50%;

    background: transparent;
    color: white;

    cursor: pointer;

    transition:
      background 0.2s ease,
      transform 0.2s ease;

    svg {
      width: 25px;
      height: 25px;

      fill: none;
      stroke: currentColor;

      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    &:active {
      transform: scale(0.94);
    }

    &:focus-visible {
      outline: 3px solid rgba(255, 255, 255, 0.5);

      outline-offset: 2px;
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

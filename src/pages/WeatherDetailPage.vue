<!--
  WeatherDetailPage.vue

  Purpose:
  Displays detailed weather information for a selected location.
  The page loads current weather and forecast data using the latitude
  and longitude from the route. It provides current conditions,
  hourly and weekly forecasts, refresh, share, and delete functionality.
-->

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import WeatherHero from '@/components/organisms/WeatherHero.vue'
import HourlyForecast from '@/components/organisms/HourlyForecast.vue'
import DailyForecast from '@/components/organisms/DailyForecast.vue'

import { useWeatherStore } from '@/stores/weather.store'

// Accesses the current route, router navigation,
// and the central Pinia weather store.
const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()

// Extracts reactive weather data and loading/error states from the store.
const { currentWeather, forecast, isLoadingWeather, weatherError } = storeToRefs(weatherStore)

// Gets the latitude of the selected location from the URL.
const latitude = computed(() => Number(route.params.lat))

// Gets the longitude of the selected location from the URL.
const longitude = computed(() => Number(route.params.lon))

// Loads weather information when the detail page first opens.
// The request is only made when valid coordinates are available.
onMounted(async () => {
  if (Number.isNaN(latitude.value) || Number.isNaN(longitude.value)) {
    return
  }

  await weatherStore.loadWeather(latitude.value, longitude.value)
})

// Requests fresh weather and forecast data for the current location.
async function handleRefreshWeather(): Promise<void> {
  await weatherStore.loadWeather(latitude.value, longitude.value)
}

// Creates a weather summary that can be shared with other applications
// using the Web Share API or copied to the clipboard as a fallback.
async function handleShareWeather(): Promise<void> {
  if (!currentWeather.value) {
    return
  }

  const city = currentWeather.value.name
  const temperature = Math.round(currentWeather.value.main.temp)

  const condition = currentWeather.value.weather[0]?.description ?? 'Unknown'

  // Creates the text that will be shared or copied.
  const shareText = `Weather in ${city}: ${temperature}°C, ${condition}.`

  try {
    // Use native Web Share API when supported
    if (navigator.share) {
      await navigator.share({
        title: `Weather in ${city}`,
        text: shareText,
      })

      return
    }

    // Fallback for browsers without Web Share
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)

      alert('Weather summary copied to clipboard!')
      return
    }

    alert('Sharing is not supported on this browser.')
  } catch (error) {
    // Does nothing when the user intentionally closes
    // or cancels the native share window.
    if (error instanceof DOMException && error.name === 'AbortError') {
      return
    }

    console.error('Unable to share weather:', error)
  }
}

// Removes the selected location from the saved locations
// and returns the user to the home page.
async function handleDeleteLocation(): Promise<void> {
  weatherStore.removeSavedLocation(latitude.value, longitude.value)

  await router.push('/')
}

// Converts the API forecast data into the format required
// by the HourlyForecast component.
const hourlyForecast = computed(() => {
  if (!forecast.value) {
    return []
  }

  // OpenWeather provides the timezone offset for the selected city.
  const timezoneOffset = forecast.value.city.timezone

  // Uses the first six forecast periods returned by the API.
  return forecast.value.list.slice(0, 6).map((item) => {
    // Converts the forecast timestamp into the selected location's local time.
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

// Converts the API forecast periods into daily forecast information
// for the Weekly Forecast section.
const dailyForecast = computed(() => {
  if (!forecast.value) {
    return []
  }

  const timezoneOffset = forecast.value.city.timezone

  // Groups multiple forecast periods belonging to the same calendar day.
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
    // Converts each forecast timestamp into the location's local time.
    const localDate = new Date((item.dt + timezoneOffset) * 1000)

    // Creates a date key used to group forecasts from the same day.
    const key = localDate.toISOString().slice(0, 10)

    // Converts the date into a readable weekday name.
    const day = localDate.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    })

    // Creates the first forecast entry for a particular day.
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

      // Updates the daily minimum and maximum temperatures
      // using the additional forecast periods for that day.
      if (existing) {
        existing.low = Math.min(existing.low, Math.round(item.main.temp_min))

        existing.high = Math.max(existing.high, Math.round(item.main.temp_max))
      }
    }
  }

  // Converts the grouped forecasts back into an array
  // and limits the weekly forecast to five days.
  return Array.from(grouped.values()).slice(0, 5)
})

// Converts the current weather timestamp into a readable
// date using the selected location's timezone.
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

// Converts the API update timestamp into the selected
// location's local time for the "Last updated" display.
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
  <!-- Main container for the selected location's weather details. -->
  <main class="detail-page">
    <div class="detail-page__container">
      <!-- Returns the user to the saved weather locations page. -->
      <RouterLink class="detail-page__back" to="/" aria-label="Back to weather list">
        ←
      </RouterLink>

      <!-- Shares the current weather summary. -->
      <button
        class="detail-page__share"
        type="button"
        aria-label="Share weather"
        title="Share weather"
        @click="handleShareWeather"
      >
        <!-- Share icon -->
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />

          <path d="M8.6 10.5l6.8-4" />
          <path d="M8.6 13.5l6.8 4" />
        </svg>
      </button>

      <!-- Removes this location from the user's saved locations. -->
      <button
        class="detail-page__delete"
        type="button"
        aria-label="Delete location"
        title="Delete location"
        @click="handleDeleteLocation"
      >
        <!-- Delete/trash icon -->
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

      <!-- Displays a loading message while weather data is being retrieved. -->
      <p v-if="isLoadingWeather" class="detail-page__status" role="status">Loading weather...</p>

      <!-- Displays an error message if the weather request fails. -->
      <p v-else-if="weatherError" class="detail-page__error" role="alert">
        {{ weatherError }}
      </p>

      <!-- Displays the weather information after current weather has loaded. -->
      <template v-else-if="currentWeather">
        <!-- Main current-weather summary. -->
        <WeatherHero
          :city="currentWeather.name"
          :date="heroDate"
          :temperature="Math.round(currentWeather.main.temp)"
          :condition="currentWeather.weather[0]?.description ?? 'Unknown'"
          :updated-at="heroUpdatedTime"
          :weather-icon="currentWeather.weather[0]?.icon ?? '03d'"
          @refresh="handleRefreshWeather"
        />

        <!-- Forecast information displayed below the main weather summary. -->
        <div class="detail-page__content">
          <!-- Displays the upcoming 3-hour forecast periods. -->
          <HourlyForecast :forecast="hourlyForecast" />

          <!-- Displays the grouped daily/weekly forecast. -->
          <DailyForecast :forecast="dailyForecast" />
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped lang="scss">
.detail-page {
  // Sets the overall background of the detail page.
  min-height: 100vh;
  background: #f8fafc;

  // Creates the centered content area for the weather detail view.
  &__container {
    position: relative;

    width: 100%;
    max-width: 720px;
    min-height: 100vh;

    margin: 0 auto;

    background: white;
  }

  // Positions and styles the back navigation button.
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

  // Positions and styles the share button.
  &__share {
    position: absolute;
    top: 22px;
    right: 72px;
    z-index: 10;

    display: grid;

    width: 44px;
    height: 44px;

    padding: 9px;

    place-items: center;

    border: none;
    border-radius: 50%;

    background: transparent;
    color: white;

    cursor: pointer;

    transition:
      background 0.2s ease,
      transform 0.2s ease;

    // Styles the share SVG icon.
    svg {
      width: 23px;
      height: 23px;

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

  // Positions and styles the delete location button.
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

    // Styles the delete SVG icon.
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

  // Arranges the hourly and daily forecast sections vertically.
  &__content {
    display: grid;
    gap: 36px;

    padding: 28px 20px 48px;
  }

  // Centers loading and error messages.
  &__status,
  &__error {
    padding: 100px 20px 40px;

    text-align: center;
  }

  // Makes API/weather errors visually distinct.
  &__error {
    color: #b42318;
  }
}
</style>

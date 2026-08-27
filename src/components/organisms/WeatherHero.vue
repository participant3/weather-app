<!--
  WeatherHero.vue

  Purpose:
  Displays the main current-weather summary at the top of the weather
  detail page. It shows the city, local date, current temperature,
  weather condition, weather icon, last updated time, and refresh control.
  The background changes dynamically based on the current weather
  condition and whether the location is experiencing day or night.
-->

<script setup lang="ts">
import { computed } from 'vue'

import { getWeatherBackground, getWeatherIconUrl } from '@/utils/weather'

// Receives the weather information required to display
// the main weather summary for the selected location.
const props = defineProps<{
  city: string
  date: string
  temperature: number
  condition: string
  updatedAt: string
  weatherIcon: string
}>()

// Emits a refresh event when the user selects
// the refresh button on the weather hero.
const emit = defineEmits<{
  refresh: []
}>()

// Determines the correct background style based on
// the current OpenWeather icon code.
const weatherBackground = computed(() => getWeatherBackground(props.weatherIcon))

// Converts the OpenWeather icon code into the image URL
// used to display the current weather icon.
const weatherIconUrl = computed(() => getWeatherIconUrl(props.weatherIcon))
</script>

<template>
  <!--
    Main weather summary section.
    The dynamic class controls the background based on
    the weather condition and day/night state.
  -->
  <section class="weather-hero" :class="`weather-hero--${weatherBackground}`">
    <!-- Displays the selected city and its local date. -->
    <div class="weather-hero__heading">
      <h1 class="weather-hero__city">
        {{ city }}
      </h1>

      <p class="weather-hero__date">
        {{ date }}
      </p>
    </div>

    <!-- Displays the current weather icon returned by OpenWeather. -->
    <img class="weather-hero__weather-icon" :src="weatherIconUrl" :alt="condition" />

    <!-- Displays the current temperature. -->
    <p class="weather-hero__temperature">{{ temperature }}°</p>

    <!-- Displays the current weather description. -->
    <p class="weather-hero__condition">
      {{ condition }}
    </p>

    <!-- Shows when the weather information was last updated. -->
    <div class="weather-hero__updated">
      <span> Last updated {{ updatedAt }} </span>

      <!-- Allows the user to request refreshed weather data. -->
      <button
        class="weather-hero__refresh"
        type="button"
        aria-label="Refresh weather"
        title="Refresh weather"
        @click="emit('refresh')"
      >
        <!-- Refresh icon -->
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6v5h-5" />

          <path d="M4 18v-5h5" />

          <path d="M6.1 9A7 7 0 0 1 18.5 6L20 11" />

          <path d="M17.9 15A7 7 0 0 1 5.5 18L4 13" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.weather-hero {
  // Defines the overall layout of the current-weather hero section.
  min-height: 430px;
  padding: 78px 24px 32px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 0 0 32px 32px;

  color: white;
  text-align: center;

  // Smoothly transitions between dynamic weather backgrounds.
  transition: background 0.3s ease;

  // Clear daytime weather
  &--clear {
    background: linear-gradient(180deg, #3f72a8 0%, #6fa8cf 100%);
  }

  // Cloudy daytime weather
  &--cloudy {
    background: linear-gradient(180deg, #667db6 0%, #8796b0 100%);
  }

  // Rainy daytime weather
  &--rain {
    background: linear-gradient(180deg, #314755 0%, #5d7180 100%);
  }

  // Storm
  &--storm {
    background: linear-gradient(180deg, #232526 0%, #414345 100%);
  }

  // Snow
  &--snow {
    background: linear-gradient(180deg, #6689b6 0%, #9dc7dc 100%);
  }

  // Mist / fog
  &--mist {
    background: linear-gradient(180deg, #657080 0%, #929cab 100%);
  }

  // Any nighttime weather
  &--night {
    background: linear-gradient(180deg, #101a35 0%, #263b63 100%);
  }

  // Centers the city name and date.
  &__heading {
    width: 100%;

    text-align: center;
  }

  // Styles the selected city name.
  &__city {
    margin: 0;

    font-size: 30px;
    font-weight: 700;
    line-height: 1.2;
  }

  // Styles the local date displayed below the city.
  &__date {
    margin: 7px 0 0;

    font-size: 15px;

    opacity: 0.85;
  }

  // Controls the size and positioning of the current weather icon.
  &__weather-icon {
    display: block;

    width: 140px;
    height: 140px;

    margin: 16px auto 0;

    object-fit: contain;
  }

  // Styles the large current temperature.
  &__temperature {
    margin: -4px 0 0;

    font-size: 72px;
    font-weight: 300;
    line-height: 1;
  }

  // Styles the current weather description.
  &__condition {
    margin: 10px 0 0;

    font-size: 19px;
    font-weight: 500;

    text-transform: capitalize;
  }

  // Arranges the last-updated time and refresh button.
  &__updated {
    margin-top: 28px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    font-size: 13px;

    opacity: 0.95;
  }

  // Styles the refresh icon button.
  &__refresh {
    display: grid;

    width: 38px;
    height: 38px;
    padding: 7px;

    place-items: center;

    border: none;
    border-radius: 50%;

    background: rgba(255, 255, 255, 0.14);
    color: white;

    cursor: pointer;

    transition:
      background 0.2s ease,
      transform 0.2s ease;

    // Styles the refresh SVG icon.
    svg {
      width: 21px;
      height: 21px;

      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    // Provides visual feedback when hovering over the refresh button.
    &:hover {
      background: rgba(255, 255, 255, 0.24);
    }

    // Provides feedback when the refresh button is pressed.
    &:active {
      transform: rotate(30deg) scale(0.94);
    }

    // Makes keyboard focus visible for accessibility.
    &:focus-visible {
      outline: 3px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }
  }
}

// Adjusts the weather hero for smaller mobile screens.
@media (max-width: 480px) {
  .weather-hero {
    min-height: 400px;
    padding: 74px 20px 28px;

    &__city {
      font-size: 27px;
    }

    &__weather-icon {
      width: 125px;
      height: 125px;
    }

    &__temperature {
      font-size: 64px;
    }
  }
}
</style>

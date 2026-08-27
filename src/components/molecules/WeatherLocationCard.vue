<!--
  WeatherLocationCard.vue

  Purpose:
  Displays the current weather information for one saved location on the
  home page. The card shows the location name, temperature, weather condition,
  weather icon, and high/low temperatures. It also changes its background
  based on the weather and day/night conditions and links to the detailed
  weather page for that location.
-->

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { WeatherLocation } from '@/types/weather'
import { getWeatherBackground, getWeatherIconUrl } from '@/utils/weather'

// Receives all weather and location information required
// to display one saved location card.
const props = defineProps<{
  location: WeatherLocation
}>()

// Converts the OpenWeather icon code into the URL
// used to display the corresponding weather icon.
const weatherIconUrl = getWeatherIconUrl(props.location.weatherIcon)

// Determines the appropriate card background based on the
// weather condition and whether it is currently day or night.
const weatherBackground = getWeatherBackground(props.location.weatherIcon)
</script>

<template>
  <!--
    The entire card acts as a link to the weather detail page.
    The latitude and longitude identify which location should be displayed.
  -->
  <RouterLink
    class="weather-card"
    :class="`weather-card--${weatherBackground}`"
    :to="{
      name: 'weather-detail',
      params: {
        lat: location.lat,
        lon: location.lon,
      },
    }"
  >
    <!-- Top section containing the location and current temperature. -->
    <div class="weather-card__top">
      <div class="weather-card__location">
        <h2 class="weather-card__city">
          {{ location.isDefaultLocation ? 'My Location' : location.city }}
        </h2>

        <p class="weather-card__subtitle">
          {{ location.subtitle }}
        </p>
      </div>

      <p class="weather-card__temperature">{{ location.temperature }}°</p>
    </div>

    <!-- Bottom section containing the weather condition and temperature range. -->
    <div class="weather-card__bottom">
      <div class="weather-card__condition">
        <!-- Displays the weather icon returned by OpenWeather. -->
        <img class="weather-card__icon" :src="weatherIconUrl" :alt="location.description" />

        <p class="weather-card__description">
          {{ location.description }}
        </p>
      </div>

      <!-- Displays the day's high and low temperatures. -->
      <p class="weather-card__range">H:{{ location.high }}° L:{{ location.low }}°</p>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.weather-card {
  // Defines the overall layout and appearance of each weather card.
  min-height: 190px;
  padding: 22px 24px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-radius: var(--radius-lg);

  color: white;
  text-decoration: none;

  overflow: hidden;
  cursor: pointer;

  // Provides visual feedback when interacting with the card.
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
  }

  // Makes keyboard navigation visible for accessibility.
  &:focus-visible {
    outline: 3px solid rgba(79, 172, 254, 0.4);
    outline-offset: 3px;
  }

  // Background used for clear daytime weather.
  &--clear {
    background: linear-gradient(135deg, #4a90c2, #78b6dc);
  }

  // Dark background used when the location is experiencing nighttime.
  &--night {
    background: linear-gradient(135deg, #172554, #334e7d);
  }

  // Background used for cloudy weather.
  &--cloudy {
    background: linear-gradient(135deg, #667db6, #8796b0);
  }

  // Background used for rainy weather.
  &--rain {
    background: linear-gradient(135deg, #314755, #5d7180);
  }

  // Background used for storm conditions.
  &--storm {
    background: linear-gradient(135deg, #232526, #414345);
  }

  // Background used for snowy weather.
  &--snow {
    background: linear-gradient(135deg, #83a4d4, #b6fbff);
  }

  // Background used for mist or fog conditions.
  &--mist {
    background: linear-gradient(135deg, #757f9a, #d7dde8);
  }

  // Arranges the location information and current temperature.
  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 20px;
  }

  // Allows the location information to fit within the available card space.
  &__location {
    min-width: 0;
  }

  // Styles the main location name.
  &__city {
    margin: 0;

    font-size: 25px;
    font-weight: 700;
    line-height: 1.15;
  }

  // Styles the secondary location information.
  &__subtitle {
    margin: 5px 0 0;

    font-size: 14px;
    opacity: 0.85;
  }

  // Styles the large current temperature displayed on the card.
  &__temperature {
    margin: 0;

    font-size: 52px;
    font-weight: 300;
    line-height: 0.95;
  }

  // Arranges the weather condition and high/low temperature range.
  &__bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    gap: 20px;
  }

  // Places the weather icon next to its description.
  &__condition {
    display: flex;
    align-items: center;

    gap: 6px;
  }

  // Controls the size and positioning of the OpenWeather icon.
  &__icon {
    width: 90px;
    height: 90px;

    margin: -12px -8px -12px -12px;

    object-fit: contain;
  }

  // Styles the description of the current weather condition.
  &__description {
    margin: 0;

    font-size: 15px;
    font-weight: 500;
    line-height: 1.3;

    text-transform: capitalize;
  }

  // Styles the daily high and low temperatures.
  &__range {
    margin: 0;

    white-space: nowrap;

    font-size: 14px;
    font-weight: 500;
  }
}

// Adjusts the card layout and typography for smaller mobile screens.
@media (max-width: 480px) {
  .weather-card {
    min-height: 175px;
    padding: 20px;

    &__city {
      font-size: 22px;
    }

    &__temperature {
      font-size: 46px;
    }

    &__icon {
      width: 80px;
      height: 80px;
    }

    &__description {
      font-size: 14px;
    }
  }
}
</style>

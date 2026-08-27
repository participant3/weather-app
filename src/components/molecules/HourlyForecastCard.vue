<!--
  HourlyForecastCard.vue

  Purpose:
  Displays the weather forecast for a single time period within the
  hourly forecast. It shows the weather icon, predicted temperature,
  and forecast time.
-->

<script setup lang="ts">
import { getWeatherIconUrl } from '@/utils/weather'

// Props contain the forecast information for one time period
// and are passed into this component by the parent hourly forecast component.
const props = defineProps<{
  time: string
  temperature: number
  icon: string
}>()

// Converts the OpenWeather icon code into the URL
// used to display the corresponding weather icon.
const iconUrl = getWeatherIconUrl(props.icon)
</script>

<template>
  <!-- Represents one individual forecast period in the hourly forecast. -->
  <article class="hour-card">
    <!-- Displays the weather condition icon. -->
    <img class="hour-card__icon" :src="iconUrl" alt="" aria-hidden="true" />

    <!-- Displays the predicted temperature. -->
    <p class="hour-card__temp">{{ temperature }}°</p>

    <!-- Displays the time associated with this forecast. -->
    <p class="hour-card__time">
      {{ time }}
    </p>
  </article>
</template>

<style scoped lang="scss">
.hour-card {
  // Defines the overall appearance and spacing of each hourly forecast card.
  min-width: 90px;
  padding: 16px 12px;
  text-align: center;
  border-radius: 18px;
  background: #dbe7ff;

  // Styles the forecast temperature.
  &__temp {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }

  // Controls the size and positioning of the weather icon.
  &__icon {
    width: 68px;
    height: 68px;
    margin: 8px auto;

    display: block;

    object-fit: contain;
  }

  // Styles the forecast time shown below the temperature.
  &__time {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 14px;
  }
}
</style>

<!--
  DailyForecastRow.vue

  Purpose:
  Displays the weather forecast for a single day within the weekly forecast.
  It shows the day of the week, weather icon, and the predicted
  minimum and maximum temperatures.
-->

<script setup lang="ts">
import { getWeatherIconUrl } from '@/utils/weather'

// Props contain the weather information for one day
// and are passed into this component by the parent forecast component.
const props = defineProps<{
  day: string
  icon: string
  condition: string
  low: number
  high: number
}>()

// Converts the OpenWeather icon code into the URL
// used to display the corresponding weather icon.
const iconUrl = getWeatherIconUrl(props.icon)
</script>

<template>
  <!-- Represents one individual day in the weekly forecast. -->
  <article class="daily-row">
    <!-- Displays the weather condition icon. -->
    <div class="daily-row__icon-container">
      <img class="daily-row__icon" :src="iconUrl" alt="" aria-hidden="true" />
    </div>

    <!-- Displays the day of the week and weather condition. -->
    <div class="daily-row__details">
      <p class="daily-row__day">
        {{ day }}
      </p>

      <p class="daily-row__condition">{{ condition }}</p>
    </div>

    <!-- Displays the forecast high temperature for the day. -->
    <p class="daily-row__temperature">{{ high }}°C</p>

    <!-- Decorative arrow displayed on the right side of the row. -->
    <span class="daily-row__arrow" aria-hidden="true"> › </span>
  </article>
</template>

<style scoped lang="scss">
.daily-row {
  // Creates the four-column layout:
  // weather icon | forecast details | temperature | arrow
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto 20px;
  align-items: center;
  gap: 14px;

  min-height: 108px;
  padding: 14px 18px;

  border-radius: 20px;

  background: #d9e5ff;

  // Circular background surrounding the weather icon.
  &__icon-container {
    display: grid;
    width: 64px;
    height: 64px;

    place-items: center;

    border-radius: 50%;

    background: #9fbbff;
  }

  // Controls the size and positioning of the weather icon.
  &__icon {
    display: block;

    width: 58px;
    height: 58px;

    object-fit: contain;
  }

  // Contains the day name and weather condition.
  &__details {
    min-width: 0;
  }

  // Styling for the day of the week.
  &__day {
    margin: 0;

    font-size: 18px;
    font-weight: 700;

    color: var(--color-text);
  }

  // Styling for the weather description.
  &__condition {
    margin: 4px 0 0;

    color: var(--color-text-secondary);
    text-transform: capitalize;
    font-size: 15px;
  }

  // Styling for the displayed daily temperature.
  &__temperature {
    margin: 0;

    white-space: nowrap;

    color: var(--color-text);

    font-size: 19px;
    font-weight: 700;
  }

  // Styling for the decorative arrow.
  &__arrow {
    color: var(--color-text);

    font-size: 30px;
    line-height: 1;
  }
}

// Adjusts the forecast row layout for smaller mobile screens.
@media (max-width: 480px) {
  .daily-row {
    grid-template-columns: 60px minmax(0, 1fr) auto 16px;

    min-height: 96px;
    padding: 12px 14px;
    gap: 10px;

    &__icon-container {
      width: 54px;
      height: 54px;
    }

    &__icon {
      width: 50px;
      height: 50px;
    }

    &__day {
      font-size: 16px;
    }

    &__condition {
      font-size: 14px;
    }

    &__temperature {
      font-size: 17px;
    }

    &__arrow {
      font-size: 26px;
    }
  }
}
</style>

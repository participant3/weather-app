<script setup lang="ts">
import type { WeatherLocation } from '@/types/weather'
import { getWeatherBackground, getWeatherIconUrl } from '@/utils/weather'

const props = defineProps<{
  location: WeatherLocation
}>()

const weatherIconUrl = getWeatherIconUrl(props.location.weatherIcon)

const weatherBackground = getWeatherBackground(props.location.weatherIcon)
</script>

<template>
  <article class="weather-card" :class="`weather-card--${weatherBackground}`">
    <div class="weather-card__top">
      <div class="weather-card__location">
        <h2 class="weather-card__city">
          {{ location.isCurrentLocation ? 'My Location' : location.city }}
        </h2>

        <p class="weather-card__subtitle">
          {{ location.subtitle }}
        </p>
      </div>

      <p class="weather-card__temperature">{{ location.temperature }}°</p>
    </div>

    <div class="weather-card__bottom">
      <div class="weather-card__condition">
        <img class="weather-card__icon" :src="weatherIconUrl" :alt="location.description" />

        <p class="weather-card__description">
          {{ location.description }}
        </p>
      </div>

      <p class="weather-card__range">H:{{ location.high }}° L:{{ location.low }}°</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.weather-card {
  min-height: 190px;
  padding: 22px 24px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-radius: var(--radius-lg);
  color: white;
  overflow: hidden;

  &--clear {
    background: linear-gradient(135deg, #4facfe, #00c6ff);
  }

  &--cloudy {
    background: linear-gradient(135deg, #667db6, #8796b0);
  }

  &--rain {
    background: linear-gradient(135deg, #314755, #5d7180);
  }

  &--storm {
    background: linear-gradient(135deg, #232526, #414345);
  }

  &--snow {
    background: linear-gradient(135deg, #83a4d4, #b6fbff);
  }

  &--mist {
    background: linear-gradient(135deg, #757f9a, #d7dde8);
  }

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  &__location {
    min-width: 0;
  }

  &__city {
    margin: 0;

    font-size: 25px;
    font-weight: 700;
    line-height: 1.15;
  }

  &__subtitle {
    margin: 5px 0 0;

    font-size: 14px;
    opacity: 0.85;
  }

  &__temperature {
    margin: 0;

    font-size: 52px;
    font-weight: 300;
    line-height: 0.95;
  }

  &__bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
  }

  &__condition {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__icon {
    width: 90px;
    height: 90px;

    margin: -12px -8px -12px -12px;

    object-fit: contain;
  }

  &__description {
    margin: 0;

    font-size: 15px;
    font-weight: 500;
    line-height: 1.3;

    text-transform: capitalize;
  }

  &__range {
    margin: 0;

    white-space: nowrap;

    font-size: 14px;
    font-weight: 500;
  }
}

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

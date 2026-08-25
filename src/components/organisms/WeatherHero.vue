<script setup lang="ts">
import { getWeatherIconUrl } from '@/utils/weather'

const props = defineProps<{
  city: string
  date: string
  temperature: number
  condition: string
  updatedAt: string
  weatherIcon: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const weatherIconUrl = getWeatherIconUrl(props.weatherIcon)
</script>

<template>
  <section class="weather-hero">
    <div class="weather-hero__heading">
      <h1 class="weather-hero__city">
        {{ city }}
      </h1>

      <p class="weather-hero__date">
        {{ date }}
      </p>
    </div>

    <img class="weather-hero__weather-icon" :src="weatherIconUrl" :alt="condition" />

    <p class="weather-hero__temperature">{{ temperature }}°</p>

    <p class="weather-hero__condition">
      {{ condition }}
    </p>

    <div class="weather-hero__updated">
      <span> Last updated {{ updatedAt }} </span>

      <button
        class="weather-hero__refresh"
        type="button"
        aria-label="Refresh weather"
        title="Refresh weather"
        @click="emit('refresh')"
      >
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
  min-height: 430px;
  padding: 78px 24px 32px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 0 0 32px 32px;

  background: linear-gradient(180deg, #2f80ed 0%, #68a5f5 100%);

  color: white;
  text-align: center;

  &__heading {
    width: 100%;
    text-align: center;
  }

  &__city {
    margin: 0;

    font-size: 30px;
    font-weight: 700;
    line-height: 1.2;
  }

  &__date {
    margin: 7px 0 0;

    font-size: 15px;

    opacity: 0.85;
  }

  &__weather-icon {
    display: block;

    width: 140px;
    height: 140px;

    margin: 16px auto 0;

    object-fit: contain;
  }

  &__temperature {
    margin: -4px 0 0;

    font-size: 72px;
    font-weight: 300;
    line-height: 1;
  }

  &__condition {
    margin: 10px 0 0;

    font-size: 19px;
    font-weight: 500;

    text-transform: capitalize;
  }

  &__updated {
    margin-top: 28px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    font-size: 13px;

    opacity: 0.95;
  }

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

    svg {
      width: 21px;
      height: 21px;

      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.24);
    }

    &:active {
      transform: rotate(30deg) scale(0.94);
    }

    &:focus-visible {
      outline: 3px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }
  }
}

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

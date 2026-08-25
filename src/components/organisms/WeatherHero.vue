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

const weatherIconUrl = getWeatherIconUrl(props.weatherIcon)
</script>

<template>
  <section class="weather-hero">
    <div class="weather-hero__top">
      <div>
        <h1>{{ city }}</h1>
        <p>{{ date }}</p>
      </div>

      <button class="weather-hero__delete" type="button" aria-label="Delete location">🗑</button>
    </div>

    <img class="weather-hero__weather-icon" :src="weatherIconUrl" :alt="condition" />

    <p class="weather-hero__temperature">{{ temperature }}°</p>

    <p class="weather-hero__condition">
      {{ condition }}
    </p>

    <div class="weather-hero__updated">
      <span>Updated {{ updatedAt }}</span>

      <button type="button">Refresh</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.weather-hero {
  padding: 24px;
  border-radius: 0 0 32px 32px;
  background: linear-gradient(180deg, #2f80ed 0%, #6ca8f8 100%);
  color: white;
  text-align: center;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;

    h1 {
      margin: 0;
      font-size: 28px;
    }

    p {
      margin: 6px 0 0;
      opacity: 0.85;
    }
  }

  &__delete {
    border: none;
    background: transparent;
    color: white;
    font-size: 22px;
  }

  &__weather-icon {
    width: 130px;
    height: 130px;

    margin: 18px auto 0;

    display: block;

    object-fit: contain;
  }

  &__temperature {
    margin: 8px 0 0;
    font-size: 70px;
    font-weight: 300;
    line-height: 1;
  }

  &__condition {
    margin: 8px 0 0;
    font-size: 20px;
  }

  &__updated {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    gap: 16px;
    align-items: center;
    font-size: 13px;

    button {
      border: none;
      background: transparent;
      color: white;
      font-weight: 700;
    }
  }
}
</style>

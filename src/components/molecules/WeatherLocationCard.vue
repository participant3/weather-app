<script setup lang="ts">
import type { WeatherLocation } from '@/types/weather'

defineProps<{
  location: WeatherLocation
}>()
</script>

<template>
  <article
    class="weather-card"
    :style="{
      backgroundImage: `linear-gradient(
        rgba(15, 23, 42, 0.15),
        rgba(15, 23, 42, 0.35)
      ), url(${location.backgroundImage})`,
    }"
  >
    <div class="weather-card__top">
      <div>
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
      <p class="weather-card__description">
        {{ location.description }}
      </p>

      <p class="weather-card__range">H:{{ location.high }}° L:{{ location.low }}°</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.weather-card {
  min-height: 180px;
  padding: 22px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-radius: var(--radius-lg);

  background-position: center;
  background-size: cover;

  color: white;

  overflow: hidden;

  &__top,
  &__bottom {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  &__top {
    align-items: flex-start;
  }

  &__bottom {
    align-items: flex-end;
  }

  &__city {
    margin: 0;
    font-size: 25px;
    font-weight: 700;
  }

  &__subtitle {
    margin: 4px 0 0;
    font-size: 15px;
  }

  &__temperature {
    margin: 0;
    font-size: 48px;
    font-weight: 300;
    line-height: 1;
  }

  &__description {
    max-width: 65%;
    margin: 0;
    font-size: 14px;
    line-height: 1.35;
  }

  &__range {
    margin: 0;
    white-space: nowrap;
    font-size: 14px;
  }
}
</style>

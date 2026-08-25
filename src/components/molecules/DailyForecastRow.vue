<script setup lang="ts">
import { getWeatherIconUrl } from '@/utils/weather'

const props = defineProps<{
  day: string
  icon: string
  condition: string
  low: number
  high: number
}>()

const iconUrl = getWeatherIconUrl(props.icon)
</script>

<template>
  <article class="daily-row">
    <div class="daily-row__icon-container">
      <img class="daily-row__icon" :src="iconUrl" alt="" aria-hidden="true" />
    </div>

    <div class="daily-row__details">
      <p class="daily-row__day">
        {{ day }}
      </p>

      <p class="daily-row__condition">{{ condition }}</p>
    </div>

    <p class="daily-row__temperature">{{ high }}°C</p>

    <span class="daily-row__arrow" aria-hidden="true"> › </span>
  </article>
</template>

<style scoped lang="scss">
.daily-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto 20px;
  align-items: center;
  gap: 14px;

  min-height: 108px;
  padding: 14px 18px;

  border-radius: 20px;

  background: #d9e5ff;

  &__icon-container {
    display: grid;
    width: 64px;
    height: 64px;

    place-items: center;

    border-radius: 50%;

    background: #9fbbff;
  }

  &__icon {
    display: block;

    width: 58px;
    height: 58px;

    object-fit: contain;
  }

  &__details {
    min-width: 0;
  }

  &__day {
    margin: 0;

    font-size: 18px;
    font-weight: 700;

    color: var(--color-text);
  }

  &__condition {
    margin: 4px 0 0;

    color: var(--color-text-secondary);
    text-transform: capitalize;
    font-size: 15px;
  }

  &__temperature {
    margin: 0;

    white-space: nowrap;

    color: var(--color-text);

    font-size: 19px;
    font-weight: 700;
  }

  &__arrow {
    color: var(--color-text);

    font-size: 30px;
    line-height: 1;
  }
}

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

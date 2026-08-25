<script setup lang="ts">
import { getWeatherIconUrl } from '@/utils/weather'

const props = defineProps<{
  time: string
  temperature: number
  icon: string
}>()

const iconUrl = getWeatherIconUrl(props.icon)
</script>

<template>
  <article class="hour-card">
    <img class="hour-card__icon" :src="iconUrl" alt="" aria-hidden="true" />

    <p class="hour-card__temp">{{ temperature }}°</p>

    <p class="hour-card__time">
      {{ time }}
    </p>
  </article>
</template>

<style scoped lang="scss">
.hour-card {
  min-width: 90px;
  padding: 16px 12px;
  text-align: center;
  border-radius: 18px;
  background: #dbe7ff;

  &__temp {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }

  &__icon {
    width: 68px;
    height: 68px;
    margin: 8px auto;

    display: block;

    object-fit: contain;
  }

  &__time {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 14px;
  }
}
</style>

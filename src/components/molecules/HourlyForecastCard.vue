<script setup lang="ts">
defineProps<{
  time: string
  temperature: number
  icon: string
}>()
</script>

<template>
  <article class="hour-card">
    <p class="hour-card__temp">{{ temperature }}°</p>
    <div class="hour-card__icon" aria-hidden="true">{{ icon }}</div>
    <p class="hour-card__time">{{ time }}</p>
  </article>
</template>

<style scoped lang="scss">
.hour-card {
  min-width: 90px;
  padding: 16px 12px;
  text-align: center;
  border-radius: 18px;
  background: #edf3ff;

  &__temp {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }

  &__icon {
    margin: 14px 0;
    font-size: 34px;
  }

  &__time {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 14px;
  }
}
</style>

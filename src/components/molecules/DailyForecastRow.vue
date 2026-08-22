<script setup lang="ts">
defineProps<{
  day: string
  icon: string
  low: number
  high: number
}>()
</script>

<template>
  <div class="daily-row">
    <p class="daily-row__day">{{ day }}</p>

    <div class="daily-row__icon" aria-hidden="true">
      {{ icon }}
    </div>

    <div class="daily-row__temps">
      <span>{{ low }}°</span>
      <span>{{ high }}°</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.daily-row {
  display: grid;
  grid-template-columns: 1fr 50px 100px;
  align-items: center;
  gap: 12px;

  padding: 14px 0;
  border-bottom: 1px solid #eaecf0;

  &__day {
    margin: 0;
    font-weight: 600;
  }

  &__icon {
    text-align: center;
    font-size: 28px;
  }

  &__temps {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    color: var(--color-text-secondary);

    span:last-child {
      color: var(--color-text);
      font-weight: 700;
    }
  }
}
</style>

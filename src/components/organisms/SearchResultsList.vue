<script setup lang="ts">
import type { GeoLocation } from '@/types/weather'

defineProps<{
  results: GeoLocation[]
}>()

const emit = defineEmits<{
  select: [location: GeoLocation]
}>()
</script>

<template>
  <section v-if="results.length > 0" class="search-results" aria-label="Location search results">
    <button
      v-for="location in results"
      :key="`${location.lat}-${location.lon}`"
      class="search-results__item"
      type="button"
      @click="emit('select', location)"
    >
      <span class="search-results__name">
        {{ location.name }}
      </span>

      <span class="search-results__meta">
        {{ location.state ? `${location.state}, ` : '' }}
        {{ location.country }}
      </span>
    </button>
  </section>
</template>

<style scoped lang="scss">
.search-results {
  display: grid;
  gap: 8px;
  margin-top: 10px;

  &__item {
    display: flex;
    justify-content: space-between;
    gap: 16px;

    padding: 14px 16px;

    border: 1px solid #eaecf0;
    border-radius: 12px;

    background: white;
    color: var(--color-text);
    text-align: left;
  }

  &__name {
    font-weight: 600;
  }

  &__meta {
    color: var(--color-text-secondary);
    font-size: 14px;
  }
}
</style>

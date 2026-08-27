<!--
  SearchResultsList.vue

  Purpose:
  Displays the list of locations returned from a city or airport search.
  Each search result shows the location name, state (if available), and country.
  When a user selects a result, the selected location is sent to the parent
  component so its weather information can be loaded.
-->

<script setup lang="ts">
import type { GeoLocation } from '@/types/weather'

// Receives the location search results from the parent component.
defineProps<{
  results: GeoLocation[]
}>()

// Emits the selected location back to the parent component
// when the user clicks one of the search results.
const emit = defineEmits<{
  select: [location: GeoLocation]
}>()
</script>

<template>
  <!--
    The search results section is only displayed when
    at least one matching location has been found.
  -->
  <section v-if="results.length > 0" class="search-results" aria-label="Location search results">
    <!--
      Creates a button for every location returned by the search.
      Latitude and longitude are used together to provide a unique key.
    -->
    <button
      v-for="location in results"
      :key="`${location.lat}-${location.lon}`"
      class="search-results__item"
      type="button"
      @click="emit('select', location)"
    >
      <!-- Displays the main location name. -->
      <span class="search-results__name">
        {{ location.name }}
      </span>

      <!--
        Displays additional location information.
        The state is shown when available, followed by the country.
      -->
      <span class="search-results__meta">
        {{ location.state ? `${location.state}, ` : '' }}
        {{ location.country }}
      </span>
    </button>
  </section>
</template>

<style scoped lang="scss">
.search-results {
  // Arranges the individual search results vertically.
  display: grid;
  gap: 8px;
  margin-top: 10px;

  // Styles each selectable location result.
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

  // Makes the main location name more visually prominent.
  &__name {
    font-weight: 600;
  }

  // Styles the secondary state and country information.
  &__meta {
    color: var(--color-text-secondary);
    font-size: 14px;
  }
}
</style>

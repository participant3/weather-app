<!--
  SearchBar.vue

  Purpose:
  Provides the search interface used to find weather information for a city
  or airport. It accepts the user's search text, updates the parent component
  through v-model, and emits a submit event when a search is performed.
-->

<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue'

// Props receive the current search value from the parent component
// and optionally indicate whether a search request is currently loading.
defineProps<{
  modelValue: string
  isLoading?: boolean
}>()

// Emits changes to the search input back to the parent component.
// The submit event tells the parent component to perform the search.
const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()
</script>

<template>
  <!-- Search form containing the search icon, input field, and submit button. -->
  <form class="search-bar" role="search" @submit.prevent="emit('submit')">
    <!-- Decorative search icon hidden from screen readers. -->
    <span class="search-bar__icon" aria-hidden="true">⌕</span>

    <!-- Reusable input component used to enter a city or airport. -->
    <BaseInput
      :model-value="modelValue"
      placeholder="Search for a city or airport"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <!-- Submits the search and displays a loading state while searching. -->
    <button class="search-bar__button" type="submit" :disabled="isLoading">
      {{ isLoading ? 'Searching...' : 'Search' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.search-bar {
  // Places the search input and button next to each other.
  position: relative;
  display: flex;
  gap: 10px;

  // Positions the search icon inside the input area.
  &__icon {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);

    color: #98a2b3;
    font-size: 22px;
    pointer-events: none;
  }

  // Adds additional left padding so the input text does not overlap the icon.
  :deep(.base-input) {
    padding-left: 46px;
  }

  // Styles the search button.
  &__button {
    padding: 0 18px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: white;
    font-weight: 600;

    // Shows a disabled state while a search request is running.
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>

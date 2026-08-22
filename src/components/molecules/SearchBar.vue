<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue'

defineProps<{
  modelValue: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()
</script>

<template>
  <form class="search-bar" role="search" @submit.prevent="emit('submit')">
    <span class="search-bar__icon" aria-hidden="true">⌕</span>

    <BaseInput
      :model-value="modelValue"
      placeholder="Search for a city or airport"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <button class="search-bar__button" type="submit" :disabled="isLoading">
      {{ isLoading ? 'Searching...' : 'Search' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.search-bar {
  position: relative;
  display: flex;
  gap: 10px;

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

  :deep(.base-input) {
    padding-left: 46px;
  }

  &__button {
    padding: 0 18px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: white;
    font-weight: 600;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>

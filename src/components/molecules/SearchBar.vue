<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="search-bar">
    <span class="search-bar__icon" aria-hidden="true">⌕</span>

    <BaseInput
      :model-value="modelValue"
      placeholder="Search for a city or airport"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  position: relative;

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
}
</style>

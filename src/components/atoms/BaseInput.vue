<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    class="base-input"
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>

<style scoped lang="scss">
.base-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;

  border: none;
  border-radius: var(--radius-md);

  background: var(--color-surface);
  color: var(--color-text);

  outline: none;

  &::placeholder {
    color: #98a2b3;
  }

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}
</style>

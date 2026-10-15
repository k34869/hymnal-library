<template>
  <mdui-text-field ref="input" variant="outlined" :value="modelValue" :label="label" clearable
    @input="$emit('update:modelValue', $event.target.value)">
    <mdui-button-icon slot="end-icon" icon="search"></mdui-button-icon>
  </mdui-text-field>
</template>

<script setup>
import 'mdui/components/text-field.js';
import { useTemplateRef } from 'vue';

const $input = useTemplateRef('input')

const focus = () => {
  $input.value.focus()
}

defineProps({
  label: {
    type: String,
    default: '搜索'
  },
  modelValue: String
})

const emit = defineEmits([
  'update:modelValue'
])

defineExpose({
  focus
})
</script>

<style scoped>
mdui-text-field {
  &::part(container) {
    border-radius: 50px;
    height: 54px;
    box-shadow: none;
    background-color: rgb(var(--mdui-color-surface-container-highest));
    margin: 0 8px;
  }
}
</style>
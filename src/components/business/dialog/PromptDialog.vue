<template>
  <div class="container">
    <mdui-text-field ref="input" :label="label" :value="value"></mdui-text-field>
    <div class="buttons">
      <mdui-button variant="tonal" @click="dialogStore.close">取消</mdui-button>
      <mdui-button variant="tonal" @click="submit(value)">确认</mdui-button>
    </div>
  </div>
</template>

<script setup>
import 'mdui/components/button.js';
import 'mdui/components/text-field.js';
import { onMounted, useTemplateRef } from 'vue';
import { dialogStore } from '~/stores/dialog';

defineProps({
  label: {
    default: '',
    type: String
  },
  value: {
    default: '',
    type: String
  }
})

const $input = useTemplateRef('input')

const submit = () => {
  dialogStore.onSubmit($input.value.value)
  dialogStore.close()
}

onMounted(() => {
  setTimeout(() => {
    $input.value.focus()
  }, 50);
})
</script>

<style scoped>
.container {
  .mdui-text-field {
    width: 100%;
  }
  .buttons {
    padding: 18px 5px 10px 5px;
    display: flex;
    justify-content:space-between;
  }
}
</style>
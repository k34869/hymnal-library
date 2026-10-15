<template>
  <div class="container">
    <p>{{ message }}</p>
    <div class="buttons">
      <mdui-button variant="tonal" @click="dialogStore.close">取消</mdui-button>
      <mdui-button variant="tonal" @click="submit(value)">确认</mdui-button>
    </div>
  </div>
</template>

<script setup>
import 'mdui/components/button.js';
import 'mdui/components/text-field.js';
import { dialogStore } from '~/stores/dialog';

defineProps({
  message: {
    default: '',
    type: String
  }
})

const submit = () => {
  dialogStore.onSubmit()
  dialogStore.close()
}
</script>

<style scoped>
.container {
  p {
    color: rgb(var(--mdui-color-on-surface-variant));
  }

  .buttons {
    padding: 18px 5px 10px 5px;
    display: flex;
    justify-content: flex-end;

    mdui-button {
      margin-left: 18px;
    }
  }
}
</style>
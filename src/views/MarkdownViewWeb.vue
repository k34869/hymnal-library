<template>
  <div class="container">
    <div class="markdown-content" v-show="isLoading"></div>
    <div class="loading" v-if="!isLoading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>
  </div>
</template>

<script setup>
import '~/assets/css/markedWeb.css'
import 'mdui/components/button-icon.js';
import { useRenderMarkdownWeb } from '~/hooks/useRenderMarkdownWeb'

defineOptions({
  name: 'markdown视图'
})

const { isLoading } = useRenderMarkdownWeb('.container .markdown-content')
</script>

<style scoped>
.container {
  padding: 0px 10px;

  .header {
    @apply w-screen fixed flex justify-between items-center;
    top: 0;
    padding: calc(var(--safe-area-inset-top) + 5px) 8px 5px 8px;
    box-shadow: var(--mdui-elevation-level2);
    background-color: rgb(var(--mdui-color-surface-container));
    z-index: 1;
  }

  .markdown-content {
    @apply relative left-0 right-0 m-auto;
    padding: calc(var(--safe-area-inset-top) + var(--safe-area-content-top)) 8px var(--safe-area-inset-bottom) 8px;
    max-width: 720px;
    user-select: text;
    padding-bottom: 22px;
  }

  .loading {
    padding: 120px 0;
    text-align: center;
  }
}
</style>
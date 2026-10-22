<template>
  <div class="container">
    <div class="header">
      <mdui-button-icon icon='arrow_back' @click="$router.back" title="返回( ESC )"></mdui-button-icon>
      <span class="title line-hide-1">{{ directory }}</span>
      <mdui-dropdown>
        <mdui-button-icon slot="trigger" icon="more_vert" class="more"></mdui-button-icon>
        <mdui-menu>
          <mdui-menu-item @click="share">分享</mdui-menu-item>
          <mdui-menu-item @click="promptAddItem(currentOpen.data)">添加到收藏夹</mdui-menu-item>
        </mdui-menu>
      </mdui-dropdown>
    </div>
    <div class="markdown-content" v-show="isLoading"></div>
    <div class="loading" v-if="!isLoading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>
  </div>
</template>

<script setup>
import '~/assets/css/marked.css'
import 'mdui/components/button-icon.js';
import { useRouter } from 'vue-router'
import { Share } from '@capacitor/share'
import { useRenderMarkdown } from '~/hooks/useRenderMarkdown'
import { useFavorites } from '~/stores/favorites';
import { currentOpen } from '~/stores/currentOpen';
import { useMousetrapBind } from '~/hooks/useMousetrapBind';

defineOptions({
  name: 'markdown视图'
})

const router = useRouter()
const favoritesStore = useFavorites()
const { promptAddItem } = favoritesStore
const { isLoading, directory, title, pathString } = useRenderMarkdown('.container .markdown-content')

const share = () => {
  Share.share({
    title: title.value,
    text: title.value,
    url: `https://hymnal.timeic.top/#/${encodeURI(pathString.value)}`
  })
}

useMousetrapBind({
  'esc': router.back
})
</script>

<style scoped>
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
</style>
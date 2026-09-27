<template>
  <div class="layout">
    <div class="container">
      <main id="main">
        <router-view v-slot="{ Component }">
          <component :is="Component"></component>
        </router-view>
      </main>
      <div style="text-align: center;padding-bottom: 10px;">
        <a href="https://openlist.timeic.top/#/hymnal-library/%E8%AF%97%E6%AD%8C%E5%BA%93_1.1.3.apk" target="_blank"><button style="background-color: rgba(37, 99, 235, 1);border-radius: .375rem;font-weight: 700;font-size: 1.25rem;line-height: 1.75rem;padding: .5rem .75rem;color: rgba(248, 249, 250, 1);outline: none;border: none;min-width: 150px;cursor: pointer;transition: all .2s;">下载"诗歌库"App</button></a>  
      </div>
    </div>
  </div>
</template>

<script setup>
const $link = document.createElement('link')
$link.setAttribute('rel', 'shortcut icon')
$link.setAttribute('href', 'https://cdn.jsdmirror.com/gh/k34869/hymnal-library-Web@main/resources/logo/logo.png')
$link.setAttribute('type', 'image/png')
document.head.append($link)
</script>

<style scoped>
.layout {
  height: calc(100vh + 1px);

  .container {
    main {
      @apply overflow-y-auto;
      height: calc(100vh - (var(--safe-area-inset-bottom) + 5rem));
    }
  }
}
</style>
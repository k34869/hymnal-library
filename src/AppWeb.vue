<template>
  <div class="layout">
    <div class="container">
      <main id="main">
        <router-view v-slot="{ Component }">
          <component :is="Component"></component>
        </router-view>
      </main>
      <div style="text-align: center;padding-bottom: 10px;">
        <a href="https://hymnal.timeic.top/home.html" target="_blank"><button style="background-color: rgba(37, 99, 235, 1);border-radius: .375rem;font-weight: 700;font-size: 1.25rem;line-height: 1.75rem;padding: .5rem .75rem;color: rgba(248, 249, 250, 1);outline: none;border: none;min-width: 150px;cursor: pointer;transition: all .2s;">下载"诗歌库"App</button></a>  
      </div>
    </div>
  </div>
</template>

<script setup>
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
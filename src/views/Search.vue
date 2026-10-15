<template>
  <div class="container">
    <div class="search-from">
      <Input ref="input" v-model="queryKey" title="搜索( / )" />
    </div>
    <div class="search-main">
      <FsList :data="fsList" :loading="isLoading" v-if="queryKey" />
      <div class="random-rec" v-else>
        <mdui-chip v-for="e in randomRec" @click="openMarkdown(data[e])">{{
          data[e].name }}</mdui-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'mdui/components/chip.js';
import 'mdui/components/tooltip.js';
import Input from '~/components/common/Input.vue';
import FsList from '~/components/business/FsList.vue';
import { ref, watch, onActivated, onDeactivated, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router';
import { search, data } from '~/hooks/useSearch';
import { uniqueRandoms } from '~/utils/utils';
import { useSaveScrollPosition } from '~/hooks/useSaveScrollPosition';
import { useRecent } from '~/stores/recent';
import { currentOpen } from '~/stores/currentOpen';
import { useMousetrapBind } from '~/hooks/useMousetrapBind';

const $input = useTemplateRef('input')
const router = useRouter()
const recentStore = useRecent()
let randomRec = ref(uniqueRandoms(0, data.length, 15))

const openMarkdown = (item) => {
  recentStore.add({
    path: item.path,
    type: item.type,
    name: item.name,
    description: item.description
  })
  currentOpen.data = {
    path: item.path,
    name: item.name,
    description: item.description
  }
  router.push(`/markdown-view?path=${item.path}`)
}

const queryKey = ref('')
const isLoading = ref(false)
const fsList = ref({
  type: 'map-default',
  list: null
})

useSaveScrollPosition()
useMousetrapBind({
  '/': () => {
    setTimeout(() => {
      $input.value.focus()
    }, 20);
  }
})

let stop
onActivated(() => {
  stop = watch(() => queryKey.value, (value) => {
    isLoading.value = false
    setTimeout(() => {
      const results = search(value)
      fsList.value.list = results
      isLoading.value = true
    }, 0);
  })
})

onDeactivated(() => stop)
</script>

<style scoped>
.container {
  @apply relative left-0 right-0 m-auto;
  max-width: 720px;

  .search-from {
    @apply w-full;
    position: sticky;
    top: var(--safe-area-inset-top);
    background-color: rgb(var(--mdui-color-surface));
    transform: translateY(calc(0px - var(--safe-area-inset-top)));
    padding: calc(var(--safe-area-inset-top) + 10px) 0 5px 0;
    z-index: 1;
  }

  .search-main {
    position: relative;
    top: calc(0px - var(--safe-area-inset-top));

    .init {
      padding: 48px 0;
      text-align: center;
      color: rgb(var(--mdui-color-on-surface-variant));

      .loading {
        padding: 10px 0;
      }
    }

    .random-rec {
      @apply flex justify-center items-center;
      flex-wrap: wrap;
      margin-top: 25px;

      mdui-chip {
        margin: 5px;
        font-weight: bold !important;
        border-width: 2px;
      }
    }
  }
}
</style>
<template>
  <div class="container">
    <mdui-list>
      <mdui-list-item active v-for="e in data" :headline="e.name" :description="`${e.list.length} 项`" @click="addToFavorite(item, e.name)"></mdui-list-item>
    </mdui-list>
  </div>
</template>

<script setup>
import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import { dialogStore } from '~/stores/dialog';
import { useFavorites } from '~/stores/favorites';

defineProps({
  data: Array,
  item: Object
})

const favoritesStore = useFavorites()
const { addItem } = favoritesStore

const addToFavorite = (item, name) => {
  addItem(item, name)
  dialogStore.close()
}
</script>

<style scoped>
.container {
  mdui-list-item:not(:last-child) {
    border-bottom: 0.5px solid rgba(128, 128, 128, 0.4);
  }
  .add {
    @apply flex justify-start items-center p-3;

    .icon {
      color: rgb(var(--mdui-color-primary));
    }

    .name {
      margin-left: 8px;
      transform: translateY(-1px);
      color: rgb(var(--mdui-color-on-surface-variant));
    }
  }
}
</style>
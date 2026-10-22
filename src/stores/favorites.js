import AddToFavoriteDialog from '~/components/business/dialog/AddToFavoriteDialog.vue';
import PromptDialog from '~/components/business/dialog/PromptDialog.vue';
import ConfirmDialog from '~/components/business/dialog/ConfirmDialog.vue';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { dialogStore } from '~/stores/dialog';
import { snackbar } from 'mdui';

export const useFavorites = defineStore(
  'favorites',
  () => {
    const inFavoriteName = ref('默认收藏夹');
    const favorites = ref({
      type: 'map-favorite',
      list: [
        {
          name: '默认收藏夹',
          list: [],
        },
      ],
    });

    const find = name => {
      let index;
      for (let i = 0; i < favorites.value.list.length; i++) {
        if (favorites.value.list[i].name === name) {
          index = i;
          break;
        }
      }
      return index;
    };

    const isFavorited = (index, path) => {
      let state = false;

      for (let i = 0; i < favorites.value.list[index].list.length; i++) {
        if (favorites.value.list[index].list[i].path === path) {
          state = true;
          break;
        }
      }
      return state;
    };

    const add = name => {
      favorites.value.list.unshift({
        name,
        list: [],
      });
    };

    const promptAdd = () => {
      dialogStore.title = '新建收藏夹';
      dialogStore.open(PromptDialog, {
        label: '新收藏夹名称',
      });
      dialogStore.onSubmit = value => {
        if (value) {
          add(value);
        }
      };
    };

    const rename = index => {
      dialogStore.title = '重命名';
      dialogStore.open(PromptDialog, {
        label: '修改收藏夹名称',
        value: favorites.value.list[index].name,
      });
      dialogStore.onSubmit = value => {
        if (value) favorites.value.list[index].name = value;
      };
    };

    const addItem = (item, name) => {
      const index = find(name);

      if (isFavorited(index, item.path)) {
        dialogStore.close();
        setTimeout(() => {
          dialogStore.title = '已存在';
          dialogStore.open(ConfirmDialog, {
            message: `收藏夹中已经存在 “${item.name}”, 是否重复添加?`,
          });
          dialogStore.onSubmit = () => {
            favorites.value.list[index].list.unshift(item);
            snackbar({
              message: '✅添加成功',
              autoCloseDelay: 3000,
            });
          };
        }, 250);
      } else {
        favorites.value.list[index].list.unshift(item);
        snackbar({
          message: '✅添加成功',
          autoCloseDelay: 3000,
        });
      }
    };

    const promptAddItem = item => {
      dialogStore.title = '选择一个收藏夹';
      dialogStore.open(AddToFavoriteDialog, {
        data: favorites.value.list,
        item,
      });
    };

    const remove = name => {
      const index = find(name);
      favorites.value.list.splice(index, 1);
    };

    const confirmRemove = name => {
      dialogStore.title = '删除';
      dialogStore.open(ConfirmDialog, {
        message: `是否删除 “${name}” ?`,
      });
      dialogStore.onSubmit = () => {
        remove(name);
      };
    };

    const removeItem = index => {
      const fIndex = find(inFavoriteName.value);
      dialogStore.title = '删除';
      dialogStore.open(ConfirmDialog, {
        message: `是否删除 “${favorites.value.list[fIndex].list[index].name}” ?`,
      });
      dialogStore.onSubmit = () => {
        favorites.value.list[fIndex].list.splice(index, 1);
      };
    };

    return {
      inFavoriteName,
      favorites,
      find,
      add,
      rename,
      addItem,
      promptAdd,
      promptAddItem,
      remove,
      confirmRemove,
      removeItem,
    };
  },
  {
    persist: true,
  },
);

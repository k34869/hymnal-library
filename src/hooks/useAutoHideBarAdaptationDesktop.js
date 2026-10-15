import { ref, watch, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

export function useAutoHideBarAdaptation() {
  const route = useRoute();
  const isHideBottomBar = ref(false);
  const isHide = ref(false);

  onBeforeMount(() => {
    watch(
      () => route.name,
      value => {
        if (/(markdown视图)/.test(value)) {
          isHide.value = true;
          isHideBottomBar.value = false;
        } else if (/(收藏夹详情|设置)/.test(value)) {
          isHide.value = false;
          isHideBottomBar.value = true;
        } else {
          isHide.value = false;
          isHideBottomBar.value = false;
        }
      },
    );
  });

  return { isHide, isHideBottomBar };
}

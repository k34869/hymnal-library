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

    // 安卓设备输入法弹出布局适配
    let isOrientationChange = false;
    let originHeight = document.documentElement.clientHeight;
    let orientation = window.matchMedia('(orientation: landscape)').matches;
    window.addEventListener(
      'resize',
      () => {
        if (!isOrientationChange) {
          const resizeHeight = document.documentElement.clientHeight;
          // 屏幕方向改变时不更新
          if (
            window.matchMedia('(orientation: landscape)').matches !==
            orientation
          ) {
            originHeight = resizeHeight;
            isOrientationChange = true;
            orientation = window.matchMedia('(orientation: landscape)').matches;
            setTimeout(() => {
              isOrientationChange = false;
            }, 20);
            return;
          }

          if (originHeight <= resizeHeight) {
            // Android 键盘收起后操作
            isHideBottomBar.value = false;
          } else {
            // Android 键盘弹起后操作
            isHideBottomBar.value = true;
          }
        }
      },
      false,
    );
  });

  return { isHide, isHideBottomBar };
}

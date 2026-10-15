import Mousetrap from 'mousetrap';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, onActivated, onDeactivated } from 'vue';
import { keepAliveExclude } from '~/stores/keepAliveExclude';

export function useMousetrapBind(keyMaps) {
  const route = useRoute();

  const bind = () => {
    for (const key in keyMaps) {
      if (key === 'numbers') {
        for (let i = 0; i <= 9; i++) {
          Mousetrap.bind(i.toString(), keyMaps[key]);
        }
      } else {
        Mousetrap.bind(key, keyMaps[key]);
      }
    }
  };

  const unbind = () => {
    Mousetrap.reset();
    Mousetrap.bind('enter', e => {
      if (
        e.target.nodeName === 'MDUI-BUTTON-ICON' ||
        e.target.nodeName === 'MDUI-BUTTON'
      ) {
        return;
      }
      document.activeElement.click();
    });
  };

  if (keepAliveExclude.value.includes(route.name)) {
    onMounted(bind);
    onUnmounted(unbind);
    if (route.name === '收藏夹详情' || route.name === 'markdown视图') {
      onActivated(bind);
      onDeactivated(unbind);
    }
  } else {
    onActivated(bind);
    onDeactivated(unbind);
  }
}

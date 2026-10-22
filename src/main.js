import 'mdui/mdui.css';
import '~/assets/css/global.css';
import App from './App.vue';
import router from '~/router';
import Mousetrap from 'mousetrap';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { checkUpdate } from './stores/appInfo.js';

const app = createApp(App);
app.use(router);
app.use(createPinia().use(piniaPluginPersistedstate));
app.mount('#app');
Mousetrap.bind('enter', e => {
  if (
    e.target.nodeName === 'MDUI-BUTTON-ICON' ||
    e.target.nodeName === 'MDUI-BUTTON'
  ) {
    return;
  }
  document.activeElement.click();
});

const ua = navigator.userAgent;
if (/Android/i.test(ua)) window.platformEndName = '.apk';
else if (/iPhone|iPad|iPod/i.test(ua)) window.platformEndName = '.ipa';
else if (/Macintosh|Mac OS X/i.test(ua)) {
  if (navigator.maxTouchPoints > 1) window.platformEndName = '.ipa';
} else window.platformEndName = '.apk';
checkUpdate();

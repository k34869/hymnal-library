import 'mdui/mdui.css';
import '~/assets/css/global.css';
import App from './AppDesktop.vue';
import router from '~/router/desktop.js';
import Mousetrap from 'mousetrap';
import AboutDialog from '~/components/business/dialog/AboutDialog.vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { dialogStore } from '~/stores/dialog';
import { checkUpdate } from './stores/appInfo.js';

const app = createApp(App);
app.use(router);
app.use(createPinia().use(piniaPluginPersistedstate));
app.mount('#app');

Neutralino.init();

let tray = {
  icon: '/desktop/resources/resources/logo/icon-48.png',
  menuItems: [
    { id: 'about', text: '关于' },
    { text: '-' },
    { id: 'quit', text: '退出' },
  ],
};

Neutralino.os.setTray(tray);

Neutralino.events.on('trayMenuItemClicked', event => {
  if (event.detail.id === 'about') {
    Neutralino.window.show();
    dialogStore.title = '关于诗歌库';
    dialogStore.open(AboutDialog);
  } else if (event.detail.id === 'quit') {
    Neutralino.app.exit();
  }
});

Mousetrap.bind('enter', e => {
  if (
    e.target.nodeName === 'MDUI-BUTTON-ICON' ||
    e.target.nodeName === 'MDUI-BUTTON'
  ) {
    return;
  }
  document.activeElement.click();
});

Neutralino.computer.getArch().then(arch => {
  if (NL_OS === 'Linux' && arch === 'x64') {
    window.platformEndName = '-linux_x64';
  } else if (NL_OS === 'Linux' && arch === 'arm64') {
    window.platformEndName = '-linux_arm64';
  } else if (NL_OS === 'Linux' && arch === 'arm') {
    window.platformEndName = '-linux_armhf';
  } else if (NL_OS === 'Darwin' && arch === 'arm64') {
    window.platformEndName = '-mac_arm64';
  } else if (NL_OS === 'Darwin' && arch === 'x64') {
    window.platformEndName = '-mac_x64';
  } else if (NL_OS === 'Windows' && arch === 'x64') {
    window.platformEndName = '-win_x64.exe';
  } else window.platformEndName = `-${NL_OS}_${arch}`;
  checkUpdate();
});

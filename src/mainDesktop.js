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

Neutralino.events.on('windowClose', () => {
  Neutralino.app.exit();
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

async function getPlatformArch() {
  const os = NL_OS;
  const arch = await Neutralino.computer.getArch();

  if (os === 'Linux' && arch === 'x64') {
    return '-linux_x64';
  }

  if (os === 'Linux' && arch === 'arm64') {
    return '-linux_arm64';
  }

  if (os === 'Linux' && arch === 'arm') {
    return '-linux_armhf';
  }

  if (os === 'Darwin' && arch === 'arm64') {
    return '-mac_arm64';
  }

  if (os === 'Darwin' && arch === 'x64') {
    return '-mac_x64';
  }

  if (os === 'Windows' && arch === 'x64') {
    return '-win_x64.exe';
  }

  return `-${os}_${arch}`;
}

getPlatformArch().then(platformEndName => {
  checkUpdate(platformEndName);
});

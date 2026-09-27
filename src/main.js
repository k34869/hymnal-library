import 'mdui/mdui.css';
import '~/assets/css/global.css';
import App from './App.vue';
import { createApp } from 'vue';
import router from '~/router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { checkUpdate } from './stores/appInfo.js';

const app = createApp(App);
app.use(router);
app.use(createPinia().use(piniaPluginPersistedstate));
app.mount('#app');
checkUpdate();

import 'mdui/mdui.css';
import '~/assets/css/global.css';
import App from './AppWeb.vue';
import router from '~/router/web.js';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(router);
app.use(createPinia().use(piniaPluginPersistedstate));
app.mount('#app');

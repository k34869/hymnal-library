import { createApp } from "vue";
import App from "./App.vue";
import "mdui/mdui.css";
import "~/assets/css/global.css";
import "~/assets/css/fonts.css";
import router from "~/router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { appInfo, chackUpdate, compareVersion } from "~/stores/appInfo.js";
import { App as NativeApp } from "@capacitor/app";

NativeApp.getInfo()
  .then((info) => {
    appInfo.value = info;
    chackUpdate().then((info) => {
      if (compareVersion(info.version, appInfo.value.version) === 1) {
        confirm("有新版本可用，是否前往下载?") &&
          window.open(
            `https://openlist.timeic.top/#/hymnal-library/%E8%AF%97%E6%AD%8C%E5%BA%93_${info.version}.apk`,
            "_blank",
          );
      }
    });
    const app = createApp(App);
    app.use(router);
    app.use(createPinia().use(piniaPluginPersistedstate));
    app.mount("#app");
  })
  .catch((err) => {
    return err;
  });

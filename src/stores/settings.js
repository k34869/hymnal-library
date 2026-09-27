import { ref, computed, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { SafeArea } from '@capacitor-community/safe-area';

export const useSettings = defineStore(
  'settings',
  () => {
    const isDark = ref(false);
    const isDarkWithSystem = ref(true);
    const isScreenAlways = ref(true);
    const setupPageName = ref('资料库');
    const mduiThemeName = computed(() =>
      isDarkWithSystem.value
        ? 'mdui-theme-auto'
        : isDark.value
          ? 'mdui-theme-dark'
          : 'mdui-theme-light',
    );

    async function setSafeArea(theme) {
      await SafeArea.enable({
        config: {
          customColorsForSystemBars: true,
          statusBarColor: '#00000000',
          statusBarContent: theme === 'dark' ? 'light' : 'dark',
          navigationBarColor: '#00000000',
        },
      });
    }

    function initSafeArea() {
      let inTheme = mduiThemeName.value.replace('mdui-theme-', '');
      inTheme =
        inTheme === 'auto'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : inTheme;
      setSafeArea(inTheme);
    }

    watchEffect(() =>
      isScreenAlways.value ? KeepAwake.keepAwake() : KeepAwake.allowSleep(),
    );

    watchEffect(() => {
      document.documentElement.setAttribute('class', mduiThemeName.value);
      initSafeArea();
    });

    return {
      isDark,
      isDarkWithSystem,
      isScreenAlways,
      setupPageName,
      mduiThemeName,
    };
  },
  {
    persist: true,
  },
);

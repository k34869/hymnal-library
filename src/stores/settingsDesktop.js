import { ref, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { KeepAwake } from '@capacitor-community/keep-awake';

export const useSettings = defineStore(
  'settings',
  () => {
    const isScreenAlways = ref(true);
    const setupPageName = ref('资料库');

    watchEffect(() =>
      isScreenAlways.value ? KeepAwake.keepAwake() : KeepAwake.allowSleep(),
    );

    return {
      isScreenAlways,
      setupPageName,
    };
  },
  {
    persist: true,
  },
);

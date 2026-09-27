import { snackbar } from 'mdui';
import { getFile } from '~/utils/library.js';
import { persVer } from '~/utils/utils.js';

export let cacheUrl = persVer({}, 'cache');

export function clearCache() {
  cacheUrl.value = {};
  snackbar({ message: '🔔缓存已清除!' });
}

export function listenErrorUpdateCache(el, key) {
  if (el.nodeName !== 'VIDEO') {
    el.addEventListener('error', () => {
      getFile(key).then(({ raw_url }) => {
        cacheUrl.value[key] = raw_url;
        el.setAttribute('src', raw_url);
      });
    });
  }
}

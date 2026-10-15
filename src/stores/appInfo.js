import ConfirmDialog from '~/components/business/dialog/ConfirmDialog.vue';
import { ref } from 'vue';
import { name, version, author } from '../../package.json';
import { compareVersion } from '~/utils/utils.js';
import { dialogStore } from '~/stores/dialog';

const appInfo = ref({
  name,
  version,
  author,
});

/**
 * 检查更新
 * @returns {void}
 */
function checkUpdate(platformEndName) {
  fetch(
    'https://api.github.com/repos/k34869/hymnal-library/releases/latest',
  ).then(response => {
    if (response.ok) {
      response.json().then(({ tag_name: version }) => {
        if (compareVersion(version, appInfo.value.version) === 1) {
          dialogStore.title = '更新';
          dialogStore.open(ConfirmDialog, {
            message: '有新版本可用，是否前往下载?',
          });
          dialogStore.onSubmit = () => {
            window.open(
              `https://mfbt5siz.cn-nb1.rainapp.top/d/hymnal-library/%E8%AF%97%E6%AD%8C%E5%BA%93${platformEndName}`,
              '_blank',
            );
          };
        }
      });
    }
  });
}

export { appInfo, checkUpdate };

import ConfirmDialog from '~/components/business/dialog/ConfirmDialog.vue';
import { ref } from 'vue';
import { name, version, author } from '../../package.json';
import { compareVersion } from '~/utils/utils.js';
import { dialogStore } from '~/stores/dialog';
import { persVer } from '~/utils/utils.js';

const appInfo = ref({
  name,
  version,
  author,
});

const isWait = ref(false);
const nextWeekNow = persVer(1792643947686, 'nextWeekNow');
const latestVersion = persVer(appInfo.value.version, 'latestVersion');
const isUpdate = ref(
  compareVersion(latestVersion.value, appInfo.value.version),
);

function openUpdateDialog() {
  dialogStore.title = '更新';
  dialogStore.open(ConfirmDialog, {
    message: '有新版本可用，是否前往下载?',
  });
  dialogStore.onSubmit = () => {
    window.open(
      `https://mfbt5siz.cn-nb1.rainapp.top/d/hymnal-library/%E8%AF%97%E6%AD%8C%E5%BA%93${window.platformEndName}`,
      '_blank',
    );
  };
}

/**
 * 检查更新
 * @param {boolean} [force=false] 是否强制检查更新( 默认一周检查一次 )
 * @returns {void}
 */
function checkUpdate(force = false) {
  const currentNow = Date.now();
  if (currentNow > nextWeekNow.value || force === true) {
    isWait.value = true;
    fetch('https://api.github.com/repos/k34869/hymnal-library/releases/latest')
      .then(response => {
        if (response.ok) {
          response.json().then(({ tag_name: version }) => {
            if (compareVersion(version, appInfo.value.version) === 1) {
              latestVersion.value = version;
              isUpdate.value = true;
              isWait.value = false;
              openUpdateDialog();
            }
          });
        } else {
          isWait.value = false;
        }
      })
      .catch(() => {
        isWait.value = false;
      });
    if (force === false) nextWeekNow.value = currentNow + 604800000;
  }
}

export {
  appInfo,
  checkUpdate,
  latestVersion,
  isWait,
  isUpdate,
  openUpdateDialog,
};

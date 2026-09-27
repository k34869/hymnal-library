import { ref } from 'vue';
import { name, version, author } from '../../package.json';
import { compareVersion } from '~/utils/utils.js';

const appInfo = ref({
  name,
  version,
  author,
});

/**
 * 检查更新
 * @return {void}
 */
function checkUpdate() {
  fetch(
    'https://api.github.com/repos/k34869/hymnal-library/releases/latest',
  ).then(response => {
    if (response.ok) {
      response.json().then(({ tag_name: version }) => {
        if (compareVersion(version, appInfo.value.version) === 1) {
          confirm('有新版本可用，是否前往下载?') &&
            window.open(
              `https://openlist.timeic.top/#/hymnal-library/%E8%AF%97%E6%AD%8C%E5%BA%93_${info.version}.apk`,
              '_blank',
            );
        }
      });
    }
  });
}

export { appInfo, checkUpdate };

import { ref } from 'vue';

const exclude1 = ['收藏夹详情', 'markdown视图', '设置'];
const exclude2 = ['markdown视图', '设置'];
let keepAliveExclude = ref(exclude1);

function applyExclude(num) {
  keepAliveExclude.value = num === 2 ? exclude2 : exclude1;
}

export { keepAliveExclude, applyExclude };

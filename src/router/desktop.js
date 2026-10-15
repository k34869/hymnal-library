import { createRouter, createWebHashHistory } from 'vue-router';
import Library from '~/views/Library.vue';
import Recent from '~/views/Recent.vue';
import Favorite from '~/views/Favorite.vue';
import FavoriteDetail from '~/views/FavoriteDetail.vue';
import Search from '~/views/Search.vue';
import Navigation from '~/views/Navigation.vue';
import MarkdownView from '~/views/MarkdownView.vue';
import Settings from '~/views/SettingsDesktop.vue';
import { applyExclude } from '~/stores/keepAliveExclude';

const routes = [
  {
    path: '/',
    redirect: '/library',
  },
  {
    path: '/library/:pathMatch(.*)*',
    name: '资料库',
    component: Library,
    meta: {
      transition: 'fade2',
    },
  },
  {
    path: '/recent',
    name: '最近',
    component: Recent,
    meta: {
      transition: 'fade2',
    },
  },
  {
    path: '/search',
    name: '搜索',
    component: Search,
    meta: {
      transition: 'fade2',
    },
  },
  {
    path: '/navigation',
    name: '导航',
    component: Navigation,
    meta: {
      transition: 'fade2',
    },
  },
  {
    path: '/favorite',
    name: '收藏',
    component: Favorite,
    meta: {
      transition: 'fade2',
    },
  },
  {
    path: '/favorite-detail/:name',
    name: '收藏夹详情',
    component: FavoriteDetail,
    meta: {
      transition: 'fade2',
    },
  },
  {
    path: '/markdown-view',
    name: 'markdown视图',
    component: MarkdownView,
  },
  {
    path: '/settings',
    name: '设置',
    component: Settings,
    meta: {
      transition: 'fade2',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }; // 清除页面切换时浏览器的默认滚动行为
  },
});

router.beforeEach((to, from) => {
  let name = to.name;
  if (
    (from.name === '收藏夹详情' && name === 'markdown视图') ||
    (name === '收藏夹详情' && from.name === 'markdown视图')
  ) {
    applyExclude(2);
  } else {
    applyExclude(1);
  }
  // 动态设置 窗口标题
  if (name === 'markdown视图') name = to.query.path.split('/').slice(-1)[0];
  Neutralino.window.setTitle(`${name ? name + ' - ' : ''}诗歌库`);
  return true;
});

export default router;

import { createRouter, createWebHashHistory } from 'vue-router';
import MarkdownViewWeb from '~/views/MarkdownViewWeb.vue';
import Home from '~/views/Home.vue';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/:pathMatch(.*)*',
    component: MarkdownViewWeb,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

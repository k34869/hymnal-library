import { createRouter, createWebHashHistory } from 'vue-router';
import MarkdownViewWeb from '~/views/MarkdownViewWeb.vue';

const routes = [
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

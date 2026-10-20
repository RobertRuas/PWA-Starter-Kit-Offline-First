import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AppShell from '../layouts/AppShell.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppShell,
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: 'home',
        component: () => import('../pages/HomePage.vue'),
      },
      {
        path: 'records',
        component: () => import('../../features/example-records/pages/RecordsPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('../pages/SettingsPage.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

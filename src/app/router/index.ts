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
      {
        path: 'examples/data-table',
        component: () => import('../pages/examples/DataTablePage.vue'),
      },
      {
        path: 'examples/image-gallery',
        component: () => import('../pages/examples/ImageGalleryPage.vue'),
      },
      {
        path: 'examples/store-gallery',
        component: () => import('../pages/examples/StoreGalleryPage.vue'),
      },
      {
        path: 'examples/item-detail',
        component: () => import('../pages/examples/ItemDetailPage.vue'),
      },
    ],
  },
  {
    path: '/examples/login',
    component: () => import('../pages/examples/LoginPage.vue'),
  },
  {
    path: '/examples/signup',
    component: () => import('../pages/examples/SignupPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

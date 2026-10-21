import { createRouter, createWebHashHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import TabsLayout from '../layouts/TabsLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: TabsLayout,
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('../../features/example-records/pages/HomePage.vue'),
      },
      {
        path: 'records',
        name: 'records',
        component: () => import('../../features/example-records/pages/RecordsPage.vue'),
      },
      {
        path: 'records/new',
        name: 'record-new',
        component: () => import('../../features/example-records/pages/RecordFormPage.vue'),
      },
      {
        path: 'records/:id',
        name: 'record-edit',
        component: () => import('../../features/example-records/pages/RecordFormPage.vue'),
        props: true,
      },
      {
        path: 'showcase',
        name: 'showcase',
        component: () => import('../../features/example-records/pages/ShowcasePage.vue'),
      },
      {
        path: 'showcase/form',
        name: 'showcase-form',
        component: () => import('../../features/example-records/pages/ShowcaseFormPage.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../../features/example-records/pages/SettingsPage.vue'),
      },
      {
        path: 'examples/data-table',
        name: 'example-data-table',
        component: () => import('../pages/examples/DataTablePage.vue'),
      },
      {
        path: 'examples/image-gallery',
        name: 'example-image-gallery',
        component: () => import('../pages/examples/ImageGalleryPage.vue'),
      },
      {
        path: 'examples/store-gallery',
        name: 'example-store-gallery',
        component: () => import('../pages/examples/StoreGalleryPage.vue'),
      },
      {
        path: 'examples/item-detail',
        name: 'example-item-detail',
        component: () => import('../pages/examples/ItemDetailPage.vue'),
      },
    ],
  },
  {
    path: '/examples/login',
    name: 'example-login',
    component: () => import('../pages/examples/LoginPage.vue'),
  },
  {
    path: '/examples/signup',
    name: 'example-signup',
    component: () => import('../pages/examples/SignupPage.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

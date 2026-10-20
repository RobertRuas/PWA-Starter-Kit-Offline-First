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
        path: 'settings',
        name: 'settings',
        component: () => import('../../features/example-records/pages/SettingsPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

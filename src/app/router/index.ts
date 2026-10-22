import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
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
        path: 'examples/dashboard',
        name: 'example-dashboard',
        component: () => import('../pages/examples/DashboardPage.vue'),
      },
      {
        path: 'examples/contacts',
        name: 'example-contacts',
        component: () => import('../pages/examples/ContactsPage.vue'),
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

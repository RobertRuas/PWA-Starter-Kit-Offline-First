import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

declare module 'vue-router' {
  interface RouteMeta {
    breadcrumb?: string
  }
}

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
        meta: { breadcrumb: 'Inicio' },
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('../../features/projects/pages/ProjectsPage.vue'),
        meta: { breadcrumb: 'Projetos' },
      },
      {
        path: 'projects/:id',
        name: 'project-detail',
        component: () => import('../../features/projects/pages/ProjectDetailPage.vue'),
        props: true,
        meta: { breadcrumb: 'Projeto' },
      },
      {
        path: 'projects/:id/triage',
        name: 'project-triage',
        component: () => import('../../features/projects/pages/TriagePage.vue'),
        props: true,
        meta: { breadcrumb: 'Fotos por categorizar' },
      },
      {
        path: 'projects/:id/review',
        name: 'project-review',
        component: () => import('../../features/projects/pages/ReviewPage.vue'),
        props: true,
        meta: { breadcrumb: 'Revisão' },
      },
      {
        path: 'projects/:id/export',
        name: 'project-export',
        component: () => import('../../features/projects/pages/ProjectExportPage.vue'),
        props: true,
        meta: { breadcrumb: 'Exportar' },
      },
      {
        path: 'records',
        name: 'records',
        component: () => import('../../features/example-records/pages/RecordsPage.vue'),
        meta: { breadcrumb: 'Registros' },
      },
      {
        path: 'records/new',
        name: 'record-new',
        component: () => import('../../features/example-records/pages/RecordFormPage.vue'),
        meta: { breadcrumb: 'Novo registro' },
      },
      {
        path: 'records/:id',
        name: 'record-edit',
        component: () => import('../../features/example-records/pages/RecordFormPage.vue'),
        props: true,
        meta: { breadcrumb: 'Editar registro' },
      },
      {
        path: 'showcase',
        name: 'showcase',
        component: () => import('../../features/example-records/pages/ShowcasePage.vue'),
        meta: { breadcrumb: 'Vitrine' },
      },
      {
        path: 'showcase/form',
        name: 'showcase-form',
        component: () => import('../../features/example-records/pages/ShowcaseFormPage.vue'),
        meta: { breadcrumb: 'Formulario' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../../features/example-records/pages/SettingsPage.vue'),
        meta: { breadcrumb: 'Ajustes' },
      },
      {
        path: 'examples/dashboard',
        name: 'example-dashboard',
        component: () => import('../pages/examples/DashboardPage.vue'),
        meta: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'examples/contacts',
        name: 'example-contacts',
        component: () => import('../pages/examples/ContactsPage.vue'),
        meta: { breadcrumb: 'Contactos' },
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
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

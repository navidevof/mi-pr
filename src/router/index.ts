import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import indexRoute from '@/views/index.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/configuracion',
    name: 'settings',
    component: () => import('@/views/settings/index.vue'),
    children: [
      {
        path: '/configuracion',
        name: 'settings',
        component: () => import('@/views/settings/ListSettings.vue'),
      },
      {
        path: '/configuracion/categorias',
        name: 'settings-categories',
        component: () => import('@/views/settings/categories/Categories.vue'),
      },
      {
        path: '/configuracion/categorias/:categoryId',
        name: 'settings-categories-id',
        component: () => import('@/views/settings/categories/Category.vue'),
      },
      {
        path: '/configuracion/ejercicios',
        name: 'settings-exercises',
        component: () => import('@/views/settings/exercises/Exercises.vue'),
      },
      {
        path: '/configuracion/ejercicios/:exerciseId',
        name: 'settings-exercises-id',
        component: () => import('@/views/settings/exercises/Exercise.vue'),
      },
    ],
  },
  {
    path: '/pr',
    name: 'pr',
    component: () => import('@/views/pr/index.vue'),
    children: [
      {
        path: '/pr/:categoryId',
        name: 'pr-new',
        component: () => import('@/views/pr/RegisterNewPr.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'router-home',
      component: indexRoute,
      children: protectedRoutes,
      meta: {
        isProtected: true,
      },
    },
    {
      path: '/usuario',
      name: 'user-page',
      component: () => import('@/pages/Login.vue'),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const { uid } = storeToRefs(authStore);

  if (to.matched.some(record => record.meta.isProtected) && !uid.value) {
    next('/usuario');
    return;
  }
  next();
});

export default router;

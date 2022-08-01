import { createRouter, createWebHistory } from 'vue-router';

// import ContactCoach from './pages/requests/ContactCoach.vue';
// import RequestReceived from './pages/requests/RequestReceived.vue';
// import CoachDetail from './pages/coaches/CoachDetail.vue';
import CoachesList from './pages/coaches/CoachesList.vue';
// import CoachRegistration from './pages/coaches/CoachRegistration.vue';
import NotFound from './pages/NotFound.vue';
// import UserAuth from './pages/auth/UserAuth.vue';
import store from './store/index';

const ContactCoach = () => import('./pages/requests/ContactCoach.vue');

const RequestReceived = () => import('./pages/requests/RequestReceived.vue');

const CoachDetail = () => import('./pages/coaches/CoachDetail.vue');

const CoachRegistration = () => import('./pages/coaches/CoachRegistration.vue');

const UserAuth = () => import('./pages/auth/UserAuth.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      props: true,
      component: CoachDetail,
      children: [{ path: 'contact', component: ContactCoach, props: true }],
    },
    {
      path: '/register',
      component: CoachRegistration,
      meta: { requireAuth: true },
    },
    {
      path: '/requests',
      component: RequestReceived,
      meta: { requireAuth: true },
    },
    { path: '/:notFound(.*)', component: NotFound },
    { path: '/auth', component: UserAuth, meta: { requireUnAuth: true } },
  ],
});
router.beforeEach((to, _, next) => {
  if (to.meta.requireAuth && !store.getters.isAuthenticated) {
    next('/auth'); // 未登录用户访问需登录才能访问页面，重定向至登录页
  } else if (to.meta.requireUnAuth && store.getters.isAuthenticated) {
    next('/coaches'); // 登录用户想进入/auth，重定向至首页
  } else {
    next();
  }
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/overview',
    },
    {
      path: '/overview',
      name: 'Overview',
      component: () => import('@/views/overview/index.vue'),
      meta: {
        title: '气象雷达预测系统 - 总览',
      },
    },
    {
      path: '/map',
      name: 'Map',
      component: () => import('@/views/map/index.vue'),
      meta: {
        title: '气象雷达预测系统 - 地图中心',
      },
    },
    {
      path: '/warning',
      name: 'Warning',
      component: () => import('@/views/warning/index.vue'),
      meta: {
        title: '气象雷达预测系统 - 预警中心',
      },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '气象雷达预测系统'
  next()
})

export default router

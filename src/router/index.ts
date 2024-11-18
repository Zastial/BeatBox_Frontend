import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddBeatView from '../views/AddBeatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/addbeat',
      name: 'addbeat',
      component: AddBeatView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router

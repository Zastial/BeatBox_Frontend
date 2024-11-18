import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddBeatView from '../views/AddBeatView.vue'
import BeatsView from '@/views/BeatsView.vue'
import BeatView from '@/views/BeatView.vue'

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
      path: '/beats',
      name: 'beats',
      component: BeatsView,
    },
    {
      path: '/beat',
      name: 'beat',
      component: BeatView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddSongView from '../views/AddSongView.vue'
import BeatsView from '@/views/BeatsView.vue'
import BeatView from '@/views/BeatView.vue'
import VocalsView from '@/views/VocalsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/addsong',
      name: 'addsong',
      component: AddSongView,
    },
    {
      path: '/beats',
      name: 'beats',
      component: BeatsView,
    },
    {
      path: '/beat/:beat_id',
      name: 'beat',
      component: BeatView,
    },
    {
      path: '/vocals',
      name: 'vocals',
      component: VocalsView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router

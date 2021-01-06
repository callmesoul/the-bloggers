import { createRouter, createWebHistory } from 'vue-router'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./layouts/BaseLayout.vue'),
      children: [
        { path: '/admin/website', name: 'website', component: () => import('./views/Website.vue'), meta: { title: '网站', icon: 'folder' } },
        { path: '/admin/article', name: 'article', component: () => import('./views/Article.vue'), meta: { title: '文章', icon: 'document' } }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    }
  ]
})

export default router
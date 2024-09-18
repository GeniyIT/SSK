import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/Pages/MainPage.vue";
import AdminPage from "@/Pages/AdminPage.vue";
import LoginPage from "@/Pages/LoginPage.vue";
import ProductsPage from "@/Pages/ProductsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainPage
    },
    {
      path: '/products',
      component: ProductsPage
    },
    {
      path: '/admin',
      component: AdminPage
    },
    {
      path: '/login',
      component: LoginPage
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import MerchantPage from './components/MerchantPage.vue';

const routes = [
  {
    path: '/merchant',
    component: MerchantPage
  },
  {
    path: '/hello',
    component: HelloWorld
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

import Vue from 'vue';
import Router from 'vue-router';
import MerchantPage from './views/MerchantPage.vue';
import BuyerPage from './views/BuyerPage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/merchant',
      component: MerchantPage
    },
    {
      path: '/buyer',
      component: BuyerPage
    }
  ]
});

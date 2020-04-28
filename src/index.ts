import AppComponent from '@/App.vue';
import Vue from "vue";
import router from './router';

require('@/index.scss');

const app: Vue = new Vue({
  render: h => h(AppComponent),
  router
}).$mount('#app');
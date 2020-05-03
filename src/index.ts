import AppComponent from '@/App.vue';
import Vue from "vue";
import router from './router';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

require('@/css/index.scss');

const app: Vue = new Vue({
  render: h => h(AppComponent),
  router
}).$mount('#app');

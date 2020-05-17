import AppComponent from '@/App.vue';
import Vue from "vue";
import router from './router';
import store from "./store/store";
import smoothscroll from 'smoothscroll-polyfill';
import 'vue-datetime/dist/vue-datetime.css';

smoothscroll.polyfill();

require('@/css/index.scss');

Vue.component('paginate', require('vuejs-paginate'));
Vue.component('datetime', require('vue-datetime').Datetime);

const app: Vue = new Vue({
  render: h => h(AppComponent),
  router,
  store
}).$mount('#app');

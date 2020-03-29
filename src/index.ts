import Vue from "vue";
import VueRouter from "vue-router";
import router from './router';
import AppComponent from '@/App.vue';
import { QuestionViewFactory } from "./models/vote/Vote";

require('@/index.scss');

const app: Vue = new Vue({
  render: h => h(AppComponent),
  router
}).$mount('#app');
import Vue from "vue";
import VueRouter from "vue-router";
import router from './router';
import AppComponent from '@/App';
import { QuestionViewFactory } from "./models/VoteModels";

require('@/index.scss');

const app: Vue = new Vue({
  render: h => h(AppComponent),
  router
}).$mount('#app');
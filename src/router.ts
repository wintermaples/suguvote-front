import Vue from 'vue';
import VueRouter from 'vue-router';
import TopPageComponent from "@/pages/topPage/TopPage";

Vue.use(VueRouter);

export const routes = [
  { path: '/', component: TopPageComponent },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
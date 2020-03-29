import Vue from 'vue';
import VueRouter from 'vue-router';
import MainComponent from "@/pages/main/Main.vue";

Vue.use(VueRouter);

export const routes = [
  { path: '/', component: MainComponent },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
import Vue from 'vue';
import VueRouter from 'vue-router';
import TopPageComponent from "@/pages/topPage/TopPage.vue";
import CreateVotePageComponent from "@/pages/createVotePage/createVotePage.vue";
import ListVotePageComponent from "@/pages/listVotePage/ListVotePage.vue";
import DetailVotePageComponent from "@/pages/detailVotePage/DetailVotePage.vue";

Vue.use(VueRouter);

export const routes = [
  { path: '/', component: TopPageComponent },
  { path: '/createVote', component: CreateVotePageComponent },
  { path: '/list', component: ListVotePageComponent },
  { path: '/detail/:id', component: DetailVotePageComponent },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
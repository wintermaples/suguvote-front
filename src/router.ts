import Vue from 'vue';
import VueRouter from 'vue-router';
import TopPageComponent from "@/pages/topPage/TopPage";
import CreateVotePageComponent from "@/pages/createVotePage/createVotePage";
import ListVotePageComponent from "@/pages/listVotePage/ListVotePage";

Vue.use(VueRouter);

export const routes = [
  { path: '/', component: TopPageComponent },
  { path: '/createVote', component: CreateVotePageComponent },
  { path: '/list', component: ListVotePageComponent },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
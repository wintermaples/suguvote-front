import Vue from 'vue';
import VueRouter from 'vue-router';
import TopPageComponent from "@/pages/topPage/TopPage";
import CreateVotePageComponent from "@/pages/createVotePage/createVotePage"

Vue.use(VueRouter);

export const routes = [
  { path: '/', component: TopPageComponent },
  { path: '/createVote', component: CreateVotePageComponent },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
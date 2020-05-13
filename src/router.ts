import Vue from 'vue';
import VueRouter from 'vue-router';
import TopPageComponent from "@/pages/topPage/TopPage.vue";
import CreateVotePageComponent from "@/pages/createVotePage/CreateVotePage.vue";
import ListVotePageComponent from "@/pages/listVotePage/ListVotePage.vue";
import DetailVotePageComponent from "@/pages/detailVotePage/DetailVotePage.vue";
import ManageVotePageComponent from "@/pages/manageVotePage/ManageVotePage.vue";

Vue.use(VueRouter);

export const routes = [
  { path: '/', component: TopPageComponent },
  { path: '/createVote', component: CreateVotePageComponent },
  { path: '/list', component: ListVotePageComponent },
  { path: '/detail/:id', component: DetailVotePageComponent },
  { path: '/manage/:id', component: ManageVotePageComponent },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
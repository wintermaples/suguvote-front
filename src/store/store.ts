import Vue from "vue";
import Vuex from "vuex";
import { ISuguvoteUI } from "@/store/modules/SuguvoteUIModule";
import { ISuguvotePage } from "./modules/SuguvotePageModule";

Vue.use(Vuex);

export interface State {
  suguvoteUI: ISuguvoteUI;
  suguvotePage: ISuguvotePage;
}
export default new Vuex.Store<State>({
  strict: true
});
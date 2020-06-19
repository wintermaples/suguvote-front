import Vue from "vue";
import Vuex from "vuex";
import { ISuguvoteUI } from "@/store/modules/SuguvoteUIModule";
import { ISuguvotePage } from "./modules/SuguvotePageModule";
import { ISuguvoteSession } from "./modules/SuguvoteSessionModule";

Vue.use(Vuex);

export interface State {
  suguvoteUI: ISuguvoteUI;
  suguvotePage: ISuguvotePage;
  suguvoteSession: ISuguvoteSession;
}
export default new Vuex.Store<State>({
  strict: true
});
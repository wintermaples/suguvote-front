import Vue from "vue";
import Vuex from "vuex";
import { ISuguvoteUI } from "@/store/modules/SuguvoteUIModule";

Vue.use(Vuex);

export interface State {
  suguvoteUI: ISuguvoteUI;
}
export default new Vuex.Store<State>({
  strict: true
});
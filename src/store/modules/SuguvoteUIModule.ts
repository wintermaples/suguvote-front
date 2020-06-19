import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store/store";

export interface ISuguvoteUI {
  isOpenedSharingModal: boolean;
}
@Module({ dynamic: true, store, name: "suguvote-ui", namespaced: true})
class SuguvoteUI extends VuexModule implements ISuguvoteUI {
  isOpenedSharingModal: boolean = false;

  @Mutation
  private SET_IS_OPENED_SHARING_MODAL(state: boolean) {
    this.isOpenedSharingModal = state;
  }

  @Action({})
  toggleIsOpenedSharingModal() {
    this.SET_IS_OPENED_SHARING_MODAL(!this.isOpenedSharingModal);
  }
}

export const suguvoteUIModule = getModule(SuguvoteUI);

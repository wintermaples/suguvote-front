import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store/store";

export interface ISuguvoteUI {
  isOpenedSharingModal: boolean;
}
@Module({ dynamic: true, store, name: "suguvote-ui", namespaced: true})
class SuguvoteUI extends VuexModule implements ISuguvoteUI {
  isOpenedSharingModal: boolean = false;

  @Mutation
  public SET_IS_OPENED_Sharing_MODAL(state: boolean) {
    this.isOpenedSharingModal = state;
  }

  @Action({})
  public toggleIsOpenedSharingModal() {
    this.SET_IS_OPENED_Sharing_MODAL(!this.isOpenedSharingModal);
  }
}

export const suguvoteUIModule = getModule(SuguvoteUI);

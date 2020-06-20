import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store/store";
import { SuguvotePageVue } from "@/SuguvoteVue";
import * as CommonConst from "@/const/CommonConst";

export interface ISuguvotePage {
  currentPage: SuguvotePageVue|null;
  titleAndDescriptionSetterIntervalTimer: NodeJS.Timeout|null;
}
@Module({ dynamic: true, store, name: "suguvote-page", namespaced: true})
class SuguvotePage extends VuexModule implements ISuguvotePage {
  currentPage: SuguvotePageVue|null = null;
  titleAndDescriptionSetterIntervalTimer: NodeJS.Timeout|null = null;

  @Mutation
  private SET_CURRENT_PAGE(state: SuguvotePageVue) {
    this.currentPage = state;
  }

  @Mutation
  private SET_TITLE_AND_DESCRIPTION_SETTER_INTERVAL_TIMER(state: NodeJS.Timeout) {
    this.titleAndDescriptionSetterIntervalTimer = state;
  }

  @Action({})
  switchCurrentPage(suguvotePageVue: SuguvotePageVue) {
    if (this.titleAndDescriptionSetterIntervalTimer)
      clearInterval(this.titleAndDescriptionSetterIntervalTimer);

    this.SET_CURRENT_PAGE(suguvotePageVue);

    const timer: NodeJS.Timeout = setInterval(() => {
      if (this.currentPage?.canSetTitleSuffix())
        document.title = CommonConst.DEFAULT_TITLE + (this.currentPage.getTitleSuffix() ? ` - ${this.currentPage.getTitleSuffix()}` : '');
      if (this.currentPage?.canSetDescription())
        document.querySelector('meta[name="description"]')?.setAttribute('content', this.currentPage.getDescription() ?? '');
      if (this.currentPage?.canSetTitleSuffix() && this.currentPage?.canSetDescription() && this.titleAndDescriptionSetterIntervalTimer)
        clearInterval(this.titleAndDescriptionSetterIntervalTimer);
    }, CommonConst.SET_PAGE_TITLE_OR_DESCRIPTION_INTERVAL);
    this.SET_TITLE_AND_DESCRIPTION_SETTER_INTERVAL_TIMER(timer);
  }
}

export const suguvotePageModule = getModule(SuguvotePage);

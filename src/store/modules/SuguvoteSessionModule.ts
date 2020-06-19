import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store/store";
import { api } from "@/requests/requests";

export interface ISuguvoteSession {
  isLoggedIn: boolean;
}
@Module({ dynamic: true, store, name: "suguvote-session", namespaced: true})
class SuguvoteSession extends VuexModule implements ISuguvoteSession {
  isLoggedIn: boolean = false;

  @Mutation
  private SET_IS_LOGGED_IN(state: boolean) {
    this.isLoggedIn = state;
  }

  @Action({})
  async login(username: string, password: string) {
    this.logout();
    this.SET_IS_LOGGED_IN(await api.auth.logIn(username, password));
  }

  @Action({})
  async logout() {
    this.SET_IS_LOGGED_IN(false);
    await api.auth.logOut();
  }

  @Action({})
  async fetchIsLoggedIn() {
    this.SET_IS_LOGGED_IN(await api.auth.isLoggedIn());
  }
}

export const suguvoteSessionModule = getModule(SuguvoteSession);

<template>
  <div id="app">
    <div id="headerContainer">
      <div id="header">
        <span id="headerLogo">
          <router-link to="/list">
            <img src="/static/images/logo.png" alt="Suguvote" />
          </router-link>
        </span>
        <div id="headerMenu">
          <template v-if="isLoggedInFetchedOnce">
            <div class="is-not-mobile vertical-center-container">
              <router-link
                tag="div"
                to="/createVote"
                class="btn btn-color-transparent btn-small btn-small-padding"
              >アンケートを作成</router-link>
            </div>
            <div class="is-mobile vertical-center-container">
              <router-link
                tag="img"
                to="/createVote"
                id="createVoteIcon"
                src="/static/images/pen.png"
                height="25"
                width="25"
              />
            </div>
            <img
              @click="isOpenedUserSubMenu=!isOpenedUserSubMenu"
              id="userMenuIcon"
              src="/static/images/default-user-menu-icon.png"
              height="40"
              width="40"
            />
            <SubMenuComponent
              :width.number="200"
              :height.number="150"
              :isOpened="isOpenedUserSubMenu"
              :parentElement="getUserSubMenuParentElement()"
              id="userSubMenu"
              @close="isOpenedUserSubMenu=false"
            >
            <ul>
              <li>マイページ</li>
              <li>作成したアンケート</li>
              <li class="hr"></li>
              <li>ログアウト</li>
            </ul>
            </SubMenuComponent>
          </template>
        </div>
      </div>
    </div>
    <div id="content">
      <transition name="router-transition" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <div id="footer">
      <div>
        Suguvote is in development now(Alpha dev.3-r1).&nbsp;Made by
        <a
          href="https://twitter.com/yoshi_yukky_it"
          target="_blank"
        >@yoshi_yukky_it</a>.
        <br />ご意見・バグ報告などは
        <a href="https://forms.gle/MMRpWPzd2y6zJahq7" target="_blank">こちら</a>
      </div>
    </div>
    <LogInModal :isOpened="isOpenedLogInModal" @close="isOpenedLogInModal=false" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { api } from "./requests/requests";
import { mapState } from "vuex";
import LogInModal from "@/components/modalComponents/LogInModal.vue";
import SubMenuComponent from "@/components/subMenuComponent/SubMenuComponent.vue";

@Component({
  computed: mapState("suguvote-session", [
    "isLoggedIn",
    "isLoggedInFetchedOnce"
  ]),
  components: { LogInModal, SubMenuComponent }
})
export default class AppComponent extends Vue {
  isOpenedLogInModal: boolean = false;
  isOpenedUserSubMenu: boolean = false;

  getUserSubMenuParentElement(): HTMLElement | null {
    return document.getElementById("userMenuIcon");
  }
}
</script>

<style lang="scss" scoped>
$contentMaxWidth: 1050px;
$marginHorizontal: 5%;
$paddingHorizontal: 5%;

#app {
  display: flex;
  flex-direction: column;
  min-height: calc(var(--vh, 1vh) * 100);
  justify-content: center;
  align-items: center;
}

#headerContainer {
  width: 100%;
  background-color: #f6f6f6;
  border-bottom: 1px solid lightgreen;
}

#header {
  max-width: $contentMaxWidth;
  width: calc(100% - #{$paddingHorizontal} * 2);
  height: 40px;
  margin: auto;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#headerTitle {
  font-size: 34px; // Specified with px for fitting to header.
  font-weight: bold;
}

#headerTitle a {
  text-decoration: none;
  color: #111;
}

#headerLogo {
  display: inline-flex;
  max-height: 100%;
  img {
    max-height: 40px;
    max-width: 100%;
  }
}

#content {
  width: calc(100% - #{$paddingHorizontal} * 2);
  max-width: $contentMaxWidth;
  margin: 0 auto auto auto;
}

.router-transition-enter-active,
.router-transition-leave-active {
  transition: opacity 0.2s;
}

.router-transition-enter,
.router-transition-leave-to {
  opacity: 0;
}

#footer {
  width: 100%;
  height: 40px;
  margin: 30px auto 0px auto;
  padding: 15px 0;
  background-color: #f6f6f6;
  color: #aaa;
  text-align: center;
}

#headerMenu {
  height: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
}

img#userMenuIcon, img#createVoteIcon {
  margin: 0 0.5rem;
  max-height: 100%;
  width: auto;
  cursor: pointer;
  transition: filter 0.2s ease;
  filter: brightness(100%);
  &:hover {
    filter: brightness(90%);
  }
}
</style>
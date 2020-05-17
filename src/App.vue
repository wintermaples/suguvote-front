<template>
  <div id="app">
    <div id="header">
      <span id="headerLogo">
        <router-link to="/"><img src="/static/images/logo.png" alt="Suguvote"></router-link>
      </span>
      <div id="headerMenu"></div>
    </div>
    <div id="content">
      <transition name="router-transition" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <div id="footer">
      <div>
        Suguvote is in development now(Alpha dev.2).&nbsp;Made by <a href="https://twitter.com/yoshi_yukky_it" target="_blank">@yoshi_yukky_it</a>. <br>
        ご意見・バグ報告などは<a href="https://forms.gle/MMRpWPzd2y6zJahq7" target="_blank">こちら</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class AppComponent extends Vue {}
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  // min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  justify-content: center;
  align-items: center;
}

#header {
  $paddingX: 5%;
  width: calc(100% - #{$paddingX} * 2);
  height: 40px;
  padding: 5px $paddingX;
  background-color: #f6f6f6;
  display: flex;
  border-bottom: 1px solid lightgreen;
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
  display: inline-block;
  img {
    max-height: 100%;
    max-width: 100%;
  }
}

#content {
  $paddingX: 5%;
  width: calc(100% - #{$paddingX} * 2);
  max-width: 1440px;
  padding: 0 $paddingX;
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
</style>
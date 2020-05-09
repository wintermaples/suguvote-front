<template>
  <div id="app">
    <div id="header">
      <div id="headerTitle">
        <router-link to="/">Suguvote</router-link>
      </div>
      <div id="headerMenu"></div>
    </div>
    <div id="content">
      <transition name="router-transition" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <div id="footer">
      <div>
        Made by
        <a href="https://twitter.com/yoshi_yukky">@yoshi_yukky</a>.
        <br />Suguvote is in development now(Alpha dev.1).
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
  min-height: 100vh;
  justify-content: center;
  align-items: center;
}

#header {
  $paddingX: 15%;
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

#content {
  $paddingX: 15%;
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
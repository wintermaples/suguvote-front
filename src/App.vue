<template>
  <div id="app">
    <div id="header">
      <div id="logo">
        <a href="/">
        <h1>
          Suguvote
        </h1>
        </a>
      </div>
      <div id="headerMenu">
        投票を作成する　　|　　投票する　　|　　新規登録　　|　　ログイン
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
  @Component
  export default class AppComponent extends Vue {
  }
</script>

<style lang="scss" scoped>
#header {
  padding: 0 3em;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(#000, #333);
  color: white;
}

#logo a {
  font-family: "Tryst";
  text-decoration: none;
  color: yellow;
}

</style>
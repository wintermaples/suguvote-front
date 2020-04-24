<template>
  <div id="app">
    <div id="header">
      <div id="headerTitle"><router-link to="/">Suguvote</router-link></div>
      <div id="headerMenu"></div>
    </div>
    <div id="content">
      <router-view></router-view>
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
  font-size: 34px;
  font-weight: bold;
}

#headerTitle a {
  text-decoration: none;
  color: #111;
}

#content {
  $paddingX: 15%;
  width: calc(100% - #{$paddingX} * 2);
  padding: 0 $paddingX;
}

</style>
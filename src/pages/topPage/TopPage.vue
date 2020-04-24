<template>
  <div id="topPage">
    <h1 id="title">Suguvote</h1>
    <div id="titleDescription">アンケートを簡単に「作れる」・「見つけられる」サービス</div>
    <div id="topPageSpaceFromTitleToMenu"></div>
    <div id="topPageMenu">
      <router-link to="/createVote"><div class="btn btn-large btn-color-light-sky-blue">アンケートを作る</div></router-link>
      <router-link to="/"><div class="btn btn-large btn-color-light-sky-blue">アンケートを探す</div></router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class TopPageComponent extends Vue {}
</script>

<style lang="scss" scoped>
#topPage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // 600px以上の場合は高さを画面サイズ100vhにして表示する。
  // 600px未満の場合は入り切らないのでスクロールできるようにautoにする。
  @media screen and (min-height: 600px) {
    height: calc(
      100vh - 52px
    ); // As HeaderSize = 52px ・・・ (40px + (5*2)px + (1*2)px)
  }
  @media screen and (max-height: 599px) {
    height: auto;
  }
}

h1#title {
  font-size: 400%;
  border-bottom: 2px solid lightseagreen;
  padding: 0 3em 0.5em 3em;

  animation: titleAnimation 1s ease 0.5s 1 forwards;
  transform: rotateX(90deg);
  opacity: 0;
  @keyframes titleAnimation {
    0% {
      transform: rotateX(90deg);
      opacity: 0;
    }
    100% {
      transform: rotateX(0deg);
      opacity: 1;
    }
  }
}

#titleDescription {
  font-size: 120%;

  animation: descriptionAnimation 1s ease 0.8s 1 forwards;
  transform: rotateX(90deg);
  opacity: 0;
  @keyframes descriptionAnimation {
    0% {
      transform: rotateX(90deg);
      opacity: 0;
    }
    100% {
      transform: rotateX(0deg);
      opacity: 1;
    }
  }
}

#topPageMenu {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  animation: topPageMenuAnimation 0.75s ease 1.1s 1 forwards;
  transform: translateY(30px);
  opacity: 0;
  @keyframes topPageMenuAnimation {
    0% {
      transform: translateY(30px);
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  > * {
    margin: 1em auto;
  }
}

#topPageSpaceFromTitleToMenu {
  @media screen and (min-height: 600px) {
    margin: 3em 0;
  }
}
</style>
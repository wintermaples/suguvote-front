<template>
  <div id="topPage">
    <h1 id="title">Suguvote</h1>
    <div id="titleDescription"><span class="text">アンケートを簡単に</span><span class="text">「作れる」・「見つけられる」サービス</span></div>
    <div id="topPageMenu">
      <router-link to="/createVote"><div class="btn btn-large btn-color-light-sky-blue">アンケートを作る</div></router-link>
      <router-link to="/list"><div class="btn btn-large btn-color-light-sky-blue">アンケートを探す</div></router-link>
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
  margin: auto;
  height: calc(
    100vh - 52px - 100px
  );
  // As HeaderSize = 52px ・・・ (40px + (5*2)px + (1*2)px)
  //    FooterSize = 100px ・・・(40px + (15*2)px + 30px)
  min-height: 500px - 152px;
}

h1#title {
  font-size: 4rem;
  border-bottom: 2px solid lightseagreen;
  padding: 0 3rem 0.5rem 3rem;

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
  font-size: 1.2rem;
  text-align: center;

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
    margin: 2rem auto;
  }
}
</style>
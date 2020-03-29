<template>
  <div>
    <div id="eyecatch">
      <img src="/static/images/eyecatch.png" alt="Eyecatch">
    </div>
    <div id="main">
      <div id="createVote">
        <div id="createVoteInner">
          <h2>投票を作成</h2>
          <CreateVoteComponent />
        </div>
      </div>
      <div id="doVote">
        <div id="doVoteInner">
          <h2>投票する</h2>
          aaaaa
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CreateVoteComponent from './CreateVote.vue';
  @Component({
    components: {CreateVoteComponent}
  })
  export default class MainComponent extends Vue {
    
  }
</script>

<style lang="scss" scoped>
$minWidthOfMainInnerContents: 768px / 2;

#eyecatch {
  width: 100%;
  text-align: center;
  margin: 1em auto;
  img {
    max-height: 450px;
    max-width: 100%;
  }
}

#main {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: flex-start;
  justify-content: center;

  #createVote {
    flex: 1 0 $minWidthOfMainInnerContents;

    #createVoteInner {
      width: 80%;
      margin: 3em auto;
    }
  }

  #doVote {
    flex: 1 0 $minWidthOfMainInnerContents;

    #doVoteInner {
      width: 80%;
      margin: 3em auto;
    }
  }
}

</style>
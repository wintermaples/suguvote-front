<template>
  <div id="votingResultsContainer">
    <div class="voting-result-of-one-question" v-for="(question, questionIndex) in vote.questions">
      <div class="question-title">Q{{ questionIndex + 1}}.&nbsp;{{ question.title }}</div>
      <component
        class="voting-result-of-one-question-view"
        :is="toVotingResultOfOneQuestionView(question)"
        :question="question"
        :votingResult="votingResults[questionIndex]"
        :questionIndex="questionIndex"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SuguvoteVue from "@/utils/SuguvoteVue.vue";
import { Prop } from "vue-property-decorator";
import { Vote, VotingResult } from "@/entities/VoteEntities";
import { SuguvoteComponentVue } from "@/SuguvoteVue";

@Component
export default class VotingResultsComponent extends SuguvoteComponentVue {
  @Prop()
  vote?: Readonly<Vote>;
  @Prop()
  votingResults?: Readonly<VotingResult[]>;
}
</script>

<style lang="scss" scoped>
.voting-result-of-one-question {
  margin-top: 75px;
}

.question-title {
  font-size: 130%;
  font-weight: bold;
  margin-bottom: 20px;
}

.voting-result-of-one-question-view {
  width: 600px;
  max-width: 100%;
}
</style>
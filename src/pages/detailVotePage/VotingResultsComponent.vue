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
import HelperMixin from "@/utils/HelperMixin.vue";
import { Prop } from "vue-property-decorator";
import { Vote, VotingResult } from "@/models/VoteModels";

@Component({
  mixins: [HelperMixin]
})
export default class VotingResultsComponent extends Vue {
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
}
</style>
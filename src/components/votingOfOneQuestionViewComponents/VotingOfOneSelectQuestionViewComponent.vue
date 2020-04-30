<template>
  <div>
    <div v-for="(option, index) in question.getOptions()">
      <input
        type="radio"
        :name="`vote-answer-input-${questionIndex}`"
        :id="`vote-answer-input-${questionIndex}-${index}`"
        :value="index"
        v-model="voteAnswer.checkedIndex"
        required
      />
      <label :for="`vote-answer-input-${questionIndex}-${index}`">{{ option.content }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { VotingResult, Question, OneSelectQuestion } from "@/models/VoteModels";
import { ChartConfiguration } from "chart.js";
import Chart from "chart.js";
import { VotingResultChartGenerator } from "@/chart/VotingResultChartGenerator";
import {
  VoteAnswer,
  VoteAnswerOfOneSelectQuestion
} from "../../models/VoteAnswerModel";

@Component
export default class VotingResultOfOneSelectQuestionViewComponent extends Vue {
  @Prop()
  question?: OneSelectQuestion;
  @Prop()
  voteAnswer?: VoteAnswerOfOneSelectQuestion;
  @Prop()
  questionIndex?: number;

  async mounted() {
    if (!this.question || !this.voteAnswer || this.questionIndex == null)
      return;
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div id="container" v-if="vote && votingResults.length > 0">
    <div id="backToPrevious">
      <a href="javascript:history.back();">← 前のページに戻る</a>
    </div>
    <div id="voteTitle">{{ vote.title }}</div>
    <div id="voteDescription" class="multiline-text">{{ vote.description }}</div>
    <div id="usernameContainer">{{ vote.creator }}</div>
    <div id="createdAt">作成日時:&nbsp;{{ vote.created_at }}</div>
    <div id="closingAt">締切:&nbsp;{{ vote.closing_at }}</div>
    <div id="voteCount">投票数:&nbsp;{{ vote.vote_count }}</div>
    <div id="voteButton"></div>
    <div id="voteBorder"></div>
    <div id="votingResultsContainer">
      <div class="votingResultOfOneQuestion" v-for="(question, questionIndex) in vote.questions">
        <div class="question-title">Q{{ questionIndex + 1}}.&nbsp;{{ question.title }}</div>
        <component :is="toVotingResultOfOneQuestionView(question)" :question="question" :votingResult="votingResults[questionIndex]" :index="questionIndex" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Vote, VotingResult, Question } from "@/models/VoteModels";
import { api } from "@/requests/requests";
import { plainToClass } from "class-transformer";
import { planningChartBackgroundColorScheme } from "@/utils/ChartUtil";
import Chart, { ChartConfiguration } from "chart.js";
import { VotingResultChartGenerator } from "@/chart/VotingResultChart";
import HelperMixin from "../../utils/HelperMixin.vue";

@Component({
  mixins: [HelperMixin]
})
export default class DetailVotePageComponent extends Vue {
  vote: Vote | null = null;
  votingResults: VotingResult[] = [];
  charts: Chart[] = [];

  async created() {
    try {
      this.vote = await api.votes.retrieve(parseInt(this.$route.params.id));
      this.votingResults = await api.votes.votingResults.retrieve(
        parseInt(this.$route.params.id)
      );
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
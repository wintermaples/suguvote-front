<template>
  <div id="container" v-if="vote">
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
        <div class="chart-container">
          <canvas :id="`chart${questionIndex}`"></canvas>
          <!-- TODO: Add chart detail -->
        </div>
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

@Component
export default class DetailVotePageComponent extends Vue {
  vote: Vote | null = null;
  votingResults: VotingResult[] = [];
  charts: Chart[] = [];

  async mounted() {
    try {
      this.vote = await api.votes.retrieve(parseInt(this.$route.params.id));
      this.votingResults = await api.votes.votingResults.retrieve(
        parseInt(this.$route.params.id)
      );
    } catch (err) {
      console.log(err);
    }

    // Mapping charts to canvases.
    if (!this.vote) return;
    for (let i = 0; i < this.vote.questions.length; i++) {
      const question: Question = this.vote.questions[i];
      const votingResult: VotingResult = this.votingResults[i];
      const chartCanvasElement: HTMLCanvasElement | null = <HTMLCanvasElement>(
        document.getElementById(`chart${i}`)
      );
      const chartConfiguration:
        | ChartConfiguration
        | undefined = VotingResultChartGenerator.findGenerator(
        this.vote.questions[i]
      )?.generate(question, votingResult);
      if (chartCanvasElement && chartConfiguration)
        this.charts.push(new Chart(chartCanvasElement, chartConfiguration));
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
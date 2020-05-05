<template>
  <div class="chart-container">
    <canvas :id="`chart${questionIndex}`"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { VotingResult, Question } from "@/models/VoteModels";
import { ChartConfiguration } from "chart.js";
import Chart from "chart.js";
import { VotingResultChartGenerator } from "@/chart/VotingResultChartGenerator";

@Component
export default class VotingResultOfOneSelectQuestionViewComponent extends Vue {
  @Prop()
  question?: Question;
  @Prop()
  votingResult?: VotingResult;
  @Prop()
  questionIndex?: number;
  chart: Chart | null = null;

  async mounted() {
    if (!this.question || !this.votingResult || this.questionIndex == null) return;

    const chartCanvasElement: HTMLCanvasElement | null = <HTMLCanvasElement>(
      document.getElementById(`chart${this.questionIndex}`)
    );
    const chartConfiguration:
      | ChartConfiguration
      | undefined = VotingResultChartGenerator.findGenerator(
      this.question
    )?.generate(this.question, this.votingResult);
    if (chartCanvasElement && chartConfiguration)
      this.chart = new Chart(chartCanvasElement, chartConfiguration);
  }
}
</script>

<style lang="scss" scoped>
</style>
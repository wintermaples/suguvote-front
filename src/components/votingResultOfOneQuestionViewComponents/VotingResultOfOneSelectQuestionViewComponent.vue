<template>
  <div class="chart-container">
    <canvas :id="`chart${index}`"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { VotingResult, Question } from "@/models/VoteModels";
import { ChartConfiguration } from "chart.js";
import { VotingResultChartGenerator } from "@/chart/VotingResultChart";
import Chart from "chart.js";

@Component
export default class VotingResultOfOneSelectQuestionViewComponent extends Vue {
  @Prop()
  question?: Question;
  @Prop()
  votingResult?: VotingResult;
  @Prop()
  index?: number;
  chart: Chart | null = null;

  async mounted() {
    if (!this.question || !this.votingResult || this.index == null) return;

    const chartCanvasElement: HTMLCanvasElement | null = <HTMLCanvasElement>(
      document.getElementById(`chart${this.index}`)
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
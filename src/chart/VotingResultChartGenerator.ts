import { Question, QuestionType, VotingResult, OneSelectQuestion } from "@/models/VoteModels";
import { ChartConfiguration } from "chart.js";
import { planningChartBackgroundColorScheme } from "@/utils/ChartUtil";

export abstract class VotingResultChartGenerator {
  abstract getQuestionType(): QuestionType;
  abstract generate(question: Question, votingResult: VotingResult): ChartConfiguration;
  static generators: VotingResultChartGenerator[] = [];

  static addGenerator(generator: VotingResultChartGenerator): void {
    if (this.generators.some(g => g.getQuestionType() == generator.getQuestionType()))
      throw `You are already added generator for ${generator.getQuestionType()}!`;
    this.generators.push(generator);
  }

  static findGenerator(question: Question): VotingResultChartGenerator | null {
    return this.generators.find(f => f.getQuestionType() == question.type) ?? null;
  }

}

export class VotingResultOfOneSelectQuestionChartGenerator extends VotingResultChartGenerator {
  getQuestionType(): QuestionType {
    return QuestionType.ONE_SELECT;
  }
  generate(question: Question, votingResult: VotingResult): ChartConfiguration {
    const oneSelectQuestion: OneSelectQuestion = <OneSelectQuestion>question;
    return {
      type: 'pie',
      data: {
        labels: oneSelectQuestion.getOptions().map(o => o.content),
        datasets: [{
          data: votingResult.results,
          backgroundColor: planningChartBackgroundColorScheme(oneSelectQuestion.getOptions().length)
        }]
      },
      options: {
        legend: {
          position: 'right',
          labels: {
            //Copied by original(github).
            generateLabels: function (chart: any) {
              var data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map(function (label: any, i: number) {
                  var meta = chart.getDatasetMeta(0);
                  var style = meta.controller.getStyle(i);

                  return {
                    text: `${label}: ${votingResult.results[i]}`,
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,

                    // Extra data used for toggling the correct item
                    index: i
                  };
                });
              }
              return [];
            }
          },
        }
      }
    };
  }
}

VotingResultChartGenerator.addGenerator(new VotingResultOfOneSelectQuestionChartGenerator());

import { QuestionType, Question } from "./VoteModels";
import { VueConstructor } from "vue";

export abstract class QuestionChartDetailViewFactory {
  abstract getQuestionType(): QuestionType;
  abstract generateComponent(question: Question): VueConstructor<Vue>;
  static factories: QuestionChartDetailViewFactory[] = [];
  
  static addFactory(factory: QuestionChartDetailViewFactory): void {
    if (this.factories.some(f => f.getQuestionType() == factory.getQuestionType()))
      throw `You are already added factory for ${factory.getQuestionType()}!`;
    this.factories.push(factory);
  }

  static findFactory(question: Question): QuestionChartDetailViewFactory|undefined {
    return this.factories.find(f => f.getQuestionType() == question.type);
  }
}


// class OneSelectQuestionViewFactory extends QuestionViewFactory {
//   getQuestionType(): QuestionType {
//     return QuestionType.ONE_SELECT;
//   }
//   generateComponent(question: Question): VueConstructor<Vue> {
//     return OneSelectQuestionComponent;
//   }
// }

// QuestionViewFactory.addFactory(new OneSelectQuestionViewFactory());

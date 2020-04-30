import { QuestionType, Question } from "./VoteModels";
import { VueConstructor } from "vue/types/umd";
import VotingOfOneSelectQuestionViewComponent from "@/components/votingOfOneQuestionViewComponents/VotingOfOneSelectQuestionViewComponent.vue";

export abstract class VotingOfOneQuestionViewFactory {
  abstract getQuestionType(): QuestionType;
  abstract generateComponent(question: Question): VueConstructor<Vue>;
  static factories: VotingOfOneQuestionViewFactory[] = [];
  
  static addFactory(factory: VotingOfOneQuestionViewFactory): void {
    if (this.factories.some(f => f.getQuestionType() == factory.getQuestionType()))
      throw `You are already added factory for ${factory.getQuestionType()}!`;
    this.factories.push(factory);
  }

  static findFactory(question: Question): VotingOfOneQuestionViewFactory|undefined {
    return this.factories.find(f => f.getQuestionType() == question.type);
  }
}

VotingOfOneQuestionViewFactory.addFactory(
  {getQuestionType: () => QuestionType.ONE_SELECT,
    generateComponent: () => VotingOfOneSelectQuestionViewComponent
  }
);

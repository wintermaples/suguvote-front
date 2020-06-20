import { QuestionType, Question } from "../entities/VoteEntities";
import { VueConstructor } from "vue";
import VotingResultOfOneSelectQuestionViewComponent from "@/components/votingResultOfOneQuestionViewComponents/VotingResultOfOneSelectQuestionViewComponent.vue";

export abstract class VotingResultOfOneQuestionViewFactory {
  abstract getQuestionType(): QuestionType;
  abstract generateComponent(question: Question): VueConstructor<Vue>;
  static factories: VotingResultOfOneQuestionViewFactory[] = [];
  
  static addFactory(factory: VotingResultOfOneQuestionViewFactory): void {
    if (this.factories.some(f => f.getQuestionType() == factory.getQuestionType()))
      throw `You are already added factory for ${factory.getQuestionType()}!`;
    this.factories.push(factory);
  }

  static findFactory(question: Question): VotingResultOfOneQuestionViewFactory|undefined {
    return this.factories.find(f => f.getQuestionType() == question.type);
  }
}

VotingResultOfOneQuestionViewFactory.addFactory({
  getQuestionType: function() { return QuestionType.ONE_SELECT;},
  generateComponent: function(question: Question) { return VotingResultOfOneSelectQuestionViewComponent; }
});

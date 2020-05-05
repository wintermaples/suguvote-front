import { QuestionType, Question, OneSelectQuestion } from "./VoteModels";
import { VueConstructor } from "vue";
import OneSelectQuestionComponent from "@/components/editQuestionViewComponents/OneSelectQuestion.vue";

export abstract class EditQuestionViewFactory {
  abstract getQuestionType(): QuestionType;
  abstract generateComponent(question: Question): VueConstructor<Vue>;
  static factories: EditQuestionViewFactory[] = [];
  
  static addFactory(factory: EditQuestionViewFactory): void {
    if (this.factories.some(f => f.getQuestionType() == factory.getQuestionType()))
      throw `You are already added factory for ${factory.getQuestionType()}!`;
    this.factories.push(factory);
  }

  static findFactory(question: Question): EditQuestionViewFactory|undefined {
    return this.factories.find(f => f.getQuestionType() == question.type);
  }
}


class OneSelectQuestionViewFactory extends EditQuestionViewFactory {
  getQuestionType(): QuestionType {
    return QuestionType.ONE_SELECT;
  }
  generateComponent(question: Question): VueConstructor<Vue> {
    return OneSelectQuestionComponent;
  }
}

EditQuestionViewFactory.addFactory({
  getQuestionType: () => QuestionType.ONE_SELECT,
  generateComponent: () => OneSelectQuestionComponent
});

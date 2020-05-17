import { QuestionType, Question, Vote, OneSelectQuestion } from "./VoteModels";

export class VoteAnswersFactory {
  static generate(questions: Question[]): VoteAnswer[] {
    const voteAnswers: VoteAnswer[] = [];
    questions.forEach(question => {
      switch (question.type) {
        case QuestionType.ONE_SELECT:
          voteAnswers.push(new VoteAnswerOfOneSelectQuestion((<OneSelectQuestion>question).getOptions().length - 1));
          break;
      }
    });
    return voteAnswers;
  }
}

export abstract class VoteAnswer {
  abstract toJSON(): any;
}

export class VoteAnswerOfOneSelectQuestion extends VoteAnswer {
  private _checkedIndex: number = -1;
  maxIndex: Readonly<number>;

  constructor(maxIndex: number) {
    super();
    this.maxIndex = maxIndex;
  }

  get checkedIndex(): number {
    return this._checkedIndex;
  }

  set checkedIndex(v: number) {
    if (v > this.maxIndex)
      throw `${v} is over maxIndex(${this.maxIndex}).`;

    this._checkedIndex = v;
  }

  toJSON(): any {
    return this._checkedIndex;
  }

}
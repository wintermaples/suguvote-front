import { Component } from "vue";
import { VueConstructor } from "vue/types/umd";
import { Type, plainToClass, Transform, classToPlain, classToClass } from 'class-transformer';
import { TransformationType } from "class-transformer/TransformOperationExecutor";
import { ArrayTransformFn as ArrayTransform, TypeSpecifiedArrayTransformFn } from "@/utils/TransformUtil";
import * as LimitConst from "@/const/LimitConst";
import ModelWrappedInPagination from "./ModelWrappedInPagination";

export enum QuestionType {
  ONE_SELECT = "ONE_SELECT",
  NULL = "NULL"
}

export abstract class Question {
  abstract type: QuestionType;
  title: string = '';
  constructor(title: string='') {
    this.title = title;
  }

  toViewComponent(): Component|null {
    return QuestionViewFactory.findFactory(this)?.generateComponent(this) ?? null;
  }

  static transformFn(value: Question, obj: any, type: TransformationType) {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return Question.fromObject(value);
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return classToPlain(value);
    } else if (type === TransformationType.CLASS_TO_CLASS) {
      return classToClass(value);
    }
  }
  
  static fromObject(value: any): any {
    switch(value.type) {
      case QuestionType.ONE_SELECT:
        return plainToClass(OneSelectQuestion, value);
      default:
        return null;
    }
  }

}

export class Vote {
  pk: string|undefined;
  creator: any|undefined;
  title: string = '';
  password: string|undefined;
  description: string = " ";
  tags: string[] = [];
  closing_at: Date|null = null;
  @ArrayTransform(Question.transformFn)
  questions: Question[] = [];
  created_at: string|undefined;
  updated_at: string|undefined;
  vote_count: number|undefined;
}

export class VotingResult {
  type: QuestionType = QuestionType.NULL
  results: any = {};
}

export abstract class QuestionViewFactory {
  abstract getQuestionType(): QuestionType;
  abstract generateComponent(question: Question): VueConstructor<Vue>;
  static factories: QuestionViewFactory[] = [];
  
  static addFactory(factory: QuestionViewFactory): void {
    if (this.factories.some(f => f.getQuestionType() == factory.getQuestionType()))
      throw `You are already added factory for ${factory.getQuestionType()}!`;
    this.factories.push(factory);
  }

  static findFactory(question: Question): QuestionViewFactory|null {
    return this.factories.find(f => f.getQuestionType() == question.type) ?? null;
  }
}

export class OneSelectOption {
  symbol: Symbol = Symbol();
  content: string = '';
  constructor (content: string) {
    this.content = content;
  }

  toJSON() {
    return this.content;
  }
}

export class OneSelectQuestion extends Question {
  type: QuestionType = QuestionType.ONE_SELECT;
  @Type(() => OneSelectOption)
  @ArrayTransform((optionPlain: any) => new OneSelectOption(optionPlain), { toClassOnly: true })
  private options: OneSelectOption[];
  constructor(title: string = '', options: OneSelectOption[] = []) {
    super(title);
    this.options = options;
  }

  getOptions(): Readonly<OneSelectOption[]> {
    return this.options;
  }

  addOption(option: OneSelectOption): boolean {
    if (!this.canAddOption())
      return false;
    this.options.push(option);
    return true;
  }

  deleteOption(index: number) {
    if (!this.canDeleteOption())
      return false;
    this.options.splice(index, 1);
    return true;
  }

  canAddOption() {
    return this.options.length < LimitConst.MAX_ONE_SELECT_OPTION_NUM;
  }

  canDeleteOption() {
    return LimitConst.MIN_ONE_SELECT_OPTION_NUM < this.options.length;
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

export class VoteModelWrappedInPagination extends ModelWrappedInPagination {
  @TypeSpecifiedArrayTransformFn(Vote)
  results: Vote[]|undefined;
}

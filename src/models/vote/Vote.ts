import { Component } from "vue";
import { VueConstructor } from "vue/types/umd";
import OneSelectQuestionComponent from "@/components/voteComponents/OneSelect";
import { Type, plainToClass, Transform, classToPlain, classToClass } from 'class-transformer';
import { TransformationType } from "class-transformer/TransformOperationExecutor";
import { ArrayTransformFn as ArrayTransform } from "@/utils/TransformUtil";

export enum QuestionType {
  ONE_SELECT = "ONE_SELECT"
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
  title: string = '';
  @ArrayTransform(Question.transformFn)
  questions: Question[] = [];
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
  options: OneSelectOption[];
  constructor(title: string = '', options: OneSelectOption[] = []) {
    super(title);
    this.options = options;
  }
}

class OneSelectQuestionViewFactory extends QuestionViewFactory {
  getQuestionType(): QuestionType {
    return QuestionType.ONE_SELECT;
  }
  generateComponent(question: Question): VueConstructor<Vue> {
    return OneSelectQuestionComponent;
  }
}

QuestionViewFactory.addFactory(new OneSelectQuestionViewFactory());
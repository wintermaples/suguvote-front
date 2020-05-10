import * as LimitConst from "@/const/LimitConst";
import { ArrayTransformFn as ArrayTransform } from "@/utils/TransformUtil";
import { classToClass, classToPlain, plainToClass, Type } from 'class-transformer';
import { TransformationType } from "class-transformer/TransformOperationExecutor";
import dayjs from "dayjs";

export enum QuestionType {
  ONE_SELECT = "ONE_SELECT"
}

export abstract class Question {
  abstract type: Readonly<QuestionType>;
  title: string;
  constructor(title: string='') {
    this.title = title;
  }

  static transformFn(value: any, obj: any, type: TransformationType): any {
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
  description: string = "";
  tags: string[] = [];
  closing_at: string|null = null;
  @ArrayTransform(Question.transformFn)
  questions: Question[] = [];
  created_at: string|undefined;
  updated_at: string|undefined;
  vote_count: number|undefined;

  isClosed(): boolean {
    if (!this.closing_at)
      return false;
    return dayjs(this.closing_at).isBefore(new Date());
  }
}

export class VotingResult {
  type: QuestionType|undefined;
  results: any|undefined;
}

export class OneSelectOption {
  symbol: Symbol = Symbol();
  content: string;
  constructor (content: string) {
    this.content = content;
  }

  toJSON() {
    return this.content;
  }
}

export class OneSelectQuestion extends Question {
  type: Readonly<QuestionType> = QuestionType.ONE_SELECT;
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

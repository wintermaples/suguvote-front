import { TransformationType } from "class-transformer/TransformOperationExecutor";
import { Transform, plainToClass, classToPlain, classToClass, TransformOptions } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";

export class TransformHelpers {
  static _genericTransformFn(classType: ClassType<any>, value: any, obj: any, type: TransformationType) {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return plainToClass(classType, value);
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return classToPlain(value);
    } else if (type === TransformationType.CLASS_TO_CLASS) {
      return classToClass(value);
    }
  }
  
  static ArrayTransformFn(transformFn: Function, options: TransformOptions|undefined=undefined) {
    return Transform((v,o,t) => v.map((vv: any) => transformFn(vv,o,t)), options);
  }
  
  static TypeSpecifiedArrayTransformFn(classType: ClassType<any>) {
    return Transform((v,o,t) => v.map((vv: any) => TransformHelpers._genericTransformFn(classType, vv,o,t)));
  }
  
}

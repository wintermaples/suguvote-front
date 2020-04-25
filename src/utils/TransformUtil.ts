import { TransformationType } from "class-transformer/TransformOperationExecutor";
import { Transform, plainToClass, classToPlain, classToClass } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";

function _genericTransformFn(classType: ClassType<any>, value: any, obj: any, type: TransformationType) {
  if (type === TransformationType.PLAIN_TO_CLASS) {
    return plainToClass(classType, value);
  } else if (type === TransformationType.CLASS_TO_PLAIN) {
    return classToPlain(value);
  } else if (type === TransformationType.CLASS_TO_CLASS) {
    return classToClass(value);
  }
}

export function ArrayTransformFn(transformFn: Function) {
  return Transform((v,o,t) => v.map((vv: any) => transformFn(vv,o,t)));
}

export function TypeSpecifiedArrayTransformFn(classType: ClassType<any>) {
  return Transform((v,o,t) => v.map((vv: any) => _genericTransformFn(classType, vv,o,t)));
}

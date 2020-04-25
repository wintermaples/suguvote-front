import { TransformationType } from "class-transformer/TransformOperationExecutor";
import { Transform, plainToClass, classToPlain, classToClass } from "class-transformer";

function _defaultTransformFn(value: any, obj: any, type: any) {
  if (type === TransformationType.PLAIN_TO_CLASS) {
    return plainToClass(type, obj);
  } else if (type === TransformationType.CLASS_TO_PLAIN) {
    return classToPlain(value);
  } else if (type === TransformationType.CLASS_TO_CLASS) {
    return classToClass(value);
  }
}

export function ArrayTransformFn(value: any=_defaultTransformFn) {
  return Transform((v,o,t) => v.map((vv: any) => value(vv,o,t)));
}
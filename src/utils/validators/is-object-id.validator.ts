import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line no-unused-vars
  validate(value: string, _args: ValidationArguments): boolean {
    return Types.ObjectId.isValid(value); // Check if the value is a valid ObjectId
  }

  defaultMessage(): string {
    return 'Invalid ObjectId format';
  }
}
//
// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdConstraint,
    });
  };
}

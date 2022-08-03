import { AbstractWorldObject } from '../../worldObject';
import { WorldQueryConstraint } from '../worldQuery';

export const typeConstraintFactory =
  (type: new () => AbstractWorldObject): WorldQueryConstraint =>
  (object: AbstractWorldObject) =>
    object instanceof type;

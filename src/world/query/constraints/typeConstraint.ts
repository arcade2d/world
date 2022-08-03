import { WorldObject } from '../../worldObject';
import { WorldQueryConstraint } from '../worldQuery';

export const typeConstraintFactory =
  (type: new () => WorldObject): WorldQueryConstraint =>
  (object: WorldObject) =>
    object instanceof type;

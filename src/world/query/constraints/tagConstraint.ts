import { WorldObject } from '../../worldObject';
import { WorldQueryConstraint } from '../worldQuery';

export const tagConstraintFactory =
  (tag: string): WorldQueryConstraint =>
  (object: WorldObject) =>
    object.metadata.tags.includes(tag);

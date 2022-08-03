import { getWorldObjectDefinition } from '../../../decorators/worldObjectDecorator';
import { AbstractWorldObject } from '../../worldObject';
import { WorldQueryConstraint } from '../worldQuery';

export const tagConstraintFactory =
  (tag: string): WorldQueryConstraint =>
  (object: AbstractWorldObject) =>
    getWorldObjectDefinition(object).metadata.tags?.includes(tag) ?? false;

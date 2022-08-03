import 'reflect-metadata';
import { AbstractWorldObject } from '../world/worldObject';

const METADATA_KEY = 'world:object';

export type WorldObjectDefinition = {
  readonly type: new () => AbstractWorldObject;
  readonly metadata: WorldObjectMetadata;
};

export type WorldObjectMetadata = {
  readonly name?: string;
  readonly tags?: readonly string[];
  readonly queryable?: boolean;
};

/**
 * Declares a type of object that can belong to a world.
 *
 * @param metadata Object metadata.
 */
export function WorldObject(metadata: WorldObjectMetadata): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(METADATA_KEY, { type: target, metadata }, target);
  };
}

export function getWorldObjectDefinition(
  target: AbstractWorldObject | (new () => AbstractWorldObject),
): WorldObjectDefinition {
  const definition = Reflect.getOwnMetadata(METADATA_KEY, target.constructor);

  return definition;
}

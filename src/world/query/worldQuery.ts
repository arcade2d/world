import { World } from '../world';
import { WorldObject } from '../worldObject';
import { WorldObjectRef } from '../worldObjectRef';
import { tagConstraintFactory } from './constraints/tagConstraint';
import { typeConstraintFactory } from './constraints/typeConstraint';

export type WorldQueryConstraint = (object: WorldObject) => boolean;

export class WorldQuery {
  private readonly constraints: Set<WorldQueryConstraint> = new Set();

  constructor(
    private readonly world: World,
    private readonly objects: Map<number, WorldObject>,
  ) {}

  public addConstraint(constraint: WorldQueryConstraint): this {
    this.constraints.add(constraint);

    return this;
  }

  public types(...types: readonly (new () => WorldObject)[]): this {
    for (const type of types) {
      this.addConstraint(typeConstraintFactory(type));
    }

    return this;
  }

  public tags(...tags: readonly string[]): this {
    for (const tag of tags) {
      this.addConstraint(tagConstraintFactory(tag));
    }

    return this;
  }

  public matches(object: WorldObject): boolean {
    for (const constraint of this.constraints) {
      if (!constraint(object)) {
        return false;
      }
    }

    return true;
  }

  public first(): WorldObjectRef | null {
    for (const object of this.getQueryable()) {
      if (this.matches(object)) {
        return this.world.getRef(object);
      }
    }

    return null;
  }

  public all(): readonly WorldObjectRef[] {
    const result: WorldObjectRef[] = [];

    for (const object of this.getQueryable()) {
      if (this.matches(object)) {
        result.push(this.world.getRef(object));
      }
    }

    return result;
  }

  public getQueryable(): readonly WorldObject[] {
    const result: WorldObject[] = [];

    for (const [_, object] of this.objects) {
      if (object.metadata.queryable) {
        result.push(object);
      }
    }

    return result;
  }
}

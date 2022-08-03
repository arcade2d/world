import { Vector } from '..';
import { StepInfo } from '../types';
import { WorldQuery } from './query/worldQuery';
import { WorldCamera } from './worldCamera';
import { WorldObject } from './worldObject';
import { WorldObjectRef } from './worldObjectRef';

export type WorldOptions = {
  /**
   * Handler to trigger when there is an error adding a `WorldObject` to the
   * world.
   */
  readonly onAddErrorHandler: (object: WorldObject, error: Error) => void;

  /**
   * Handler to trigger when there is an error removing a `WorldObject` from the
   * world.
   */
  readonly onRemoveErrorHandler: (object: WorldObject, error: Error) => void;
  readonly onPurgeErrorHandler: (object: WorldObject, error: Error) => void;
  readonly onStepErrorHandler: (object: WorldObject, error: Error) => void;
};

const defaultOptionsFactory = (): WorldOptions => ({
  onAddErrorHandler: (object: WorldObject, error: Error) =>
    console.error(
      `Failed to call onAdd() hook for ${object}: ${error.message}`,
    ),
  onRemoveErrorHandler: (object: WorldObject, error: Error) =>
    console.error(
      `Failed to call onRemove() hook for ${object}: ${error.message}`,
    ),
  onPurgeErrorHandler: (object: WorldObject, error: Error) =>
    console.error(
      `Failed to call onPurge() hook for ${object}: ${error.message}`,
    ),
  onStepErrorHandler: (object: WorldObject, error: Error) =>
    console.error(`Failed to call step() hook for ${object}: ${error.message}`),
});

/**
 * The world contains all of your world objects and their components.
 */
export class World {
  private lastStep?: number;

  private lastId: number = 0;
  private objects: readonly WorldObject[] = [];

  private readonly options: WorldOptions;

  private readonly refs: Map<number, WorldObject> = new Map();
  private readonly removed: Set<number> = new Set();

  public readonly camera: WorldCamera;

  constructor(options?: Partial<WorldOptions>) {
    this.options = {
      ...defaultOptionsFactory(),
      ...options,
    };

    this.camera = new WorldCamera();
  }

  /**
   * Adds an object to the world. Invokes `onAdded` on the target object.
   *
   * @param object The target object.
   */
  public add<T extends WorldObject>(object: T, position?: Vector): T {
    if (!object.world) {
      const id = this.getNextId();

      this.refs.set(id, object);
      this.objects = Array.from(this.refs.values());

      position && object.position.set(position);

      try {
        object.__register(this, id);
        object.onAdd(this);
      } catch (error: any) {
        this.options.onAddErrorHandler(object, error);
      }
    }

    return object;
  }

  /**
   * Flags the target object for removal at the conclusion of the next `step()`
   * or explicit call to `purge()`. Invokes `onRemoved` on the target object.
   *
   * @param object The target object.
   */
  public remove(object: WorldObject): void {
    if (object.world === this) {
      this.removed.add(object.id);

      try {
        object.__deregister();

        object.onRemove(this);
      } catch (error: any) {
        this.options.onRemoveErrorHandler(object, error);
      }
    }
  }

  /**
   * Determine whether the target object will be purged at the conclusion of
   * the next `step()` or explicit call to `purge()`.
   *
   * @param object The target object.
   */
  public willPurge(object: WorldObject): boolean {
    return this.removed.has(object.id);
  }

  /**
   * Determines whether or not the target object is included in this world.
   *
   * @param object The target object.
   */
  public contains(object: WorldObject): boolean {
    return this.refs.get(object.id) === object;
  }

  /**
   * Immediately removes all objects marked for removal and resets the list.
   */
  public purge(): void {
    for (const id of this.removed) {
      const object = this.refs.get(id);

      if (object) {
        this.refs.delete(id);

        try {
          object.onPurge(this);
        } catch (error: any) {
          this.options.onPurgeErrorHandler(object, error);
        }
      }
    }

    this.objects = Array.from(this.refs.values());

    this.removed.clear();
  }

  /**
   * Step through the world simulation. This method does the following in
   * sequence:
   *
   * 1. Produces a new `StepInfo` instance with delta time calculated.
   * 2. Calls the `step()` method on every world object within the world and
   * passes down the `StepInfo` that was generated.
   * 3. Calls `purge()` to clean up any objects that were marked for removal
   * during the above stage.
   * 4. Returns the `StepInfo`.
   */
  public step(): StepInfo {
    const now = Date.now();

    const info: StepInfo = {
      previous: this.lastStep ?? now,
      current: now,
      delta: now - (this.lastStep ?? now),
    };

    // Update all objects that belong to this world.
    for (const object of this.objects) {
      try {
        object.__step(this, info);
      } catch (error: any) {
        this.options.onStepErrorHandler(object, error);
      }
    }

    // Purge any objects that were marked for removal in the previous batch of
    // object updates.
    this.purge();

    // Capture last step time.
    this.lastStep = Date.now();

    return info;
  }

  /**
   * Produces an array of all the objects currently in this world.
   */
  public getObjects(): readonly WorldObject[] {
    return Array.from(this.refs.values());
  }

  /**
   * Returns a reference to an object within this world. If the target is
   * removed from this world, the target through that reference will yield
   * `null`, which makes this a useful way to safely keep references to objects
   * that *must* exist within the world to be acted on.
   *
   * @param target The target object.
   */
  public getRef<T extends WorldObject>(target: T): WorldObjectRef<T> {
    if (target.world !== this) {
      throw new Error(
        `Cannot create ref for object that doesn't belong to this world.`,
      );
    }

    return new WorldObjectRef(this.refs, this, target.id);
  }

  /**
   * Prepares a new query against this world.
   */
  public query(): WorldQuery {
    return new WorldQuery(this, this.refs);
  }

  /**
   * Returns a unique value that increments each time it's called, useful for
   * functionality that requires a unique identifier of some sort within the
   * context of this world instance.
   */
  public getNextId(): number {
    return ++this.lastId;
  }
}

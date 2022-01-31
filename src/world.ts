import { StepInfo } from './types';
import { WorldObject } from './worldObject';

export type WorldOptions = {
  readonly onAddError: (object: WorldObject, error: Error) => void;
  readonly onRemoveError: (object: WorldObject, error: Error) => void;
  readonly onPurgeError: (object: WorldObject, error: Error) => void;
  readonly onStepError: (object: WorldObject, error: Error) => void;
};

const defaultOptionsFactory = (): WorldOptions => ({
  onAddError: (object: WorldObject, error: Error) =>
    console.error(
      `Failed to call onAdd() hook for ${object}: ${error.message}`,
    ),
  onRemoveError: (object: WorldObject, error: Error) =>
    console.error(
      `Failed to call onRemove() hook for ${object}: ${error.message}`,
    ),
  onPurgeError: (object: WorldObject, error: Error) =>
    console.error(
      `Failed to call onPurge() hook for ${object}: ${error.message}`,
    ),
  onStepError: (object: WorldObject, error: Error) =>
    console.error(`Failed to call step() hook for ${object}: ${error.message}`),
});

/**
 * The world contains all of your world objects and their components.
 */
export class World {
  private lastStep?: number;

  private readonly options: WorldOptions;
  private readonly objects: Set<WorldObject>;
  private readonly removed: Set<WorldObject>;

  constructor(options?: Partial<WorldOptions>) {
    this.options = {
      ...defaultOptionsFactory(),
      ...options,
    };

    this.objects = new Set();
    this.removed = new Set();
  }

  /**
   * Adds an object to the world. Invokes `onAdded` on the target object.
   *
   * @param object The target object.
   */
  public add<T extends WorldObject>(object: T): T {
    if (!this.objects.has(object)) {
      this.objects.add(object);

      try {
        object.onAdd(this);
      } catch (error: any) {
        this.options.onAddError(object, error);
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
    if (!this.removed.has(object)) {
      this.removed.add(object);

      try {
        object.onRemove(this);
      } catch (error: any) {
        this.options.onRemoveError(object, error);
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
    return this.removed.has(object);
  }

  /**
   * Determines whether or not the target object is included in this world.
   *
   * @param object The target object.
   */
  public contains(object: WorldObject): boolean {
    return this.objects.has(object);
  }

  /**
   * Immediately removes all objects marked for removal and resets the list.
   */
  public purge(): void {
    for (const object of this.removed) {
      if (this.objects.has(object)) {
        this.objects.delete(object);

        try {
          object.onPurge(this);
        } catch (error: any) {
          this.options.onPurgeError(object, error);
        }
      }
    }

    this.removed.clear();
  }

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
        object.step(this, info);
      } catch (error: any) {
        this.options.onStepError(object, error);
      }
    }

    // Purge any objects that were marked for removal in the previous batch of
    // object updates.
    this.purge();

    // Capture last step time.
    this.lastStep = Date.now();

    return info;
  }

  public getObjects(): readonly WorldObject[] {
    return Array.from(this.objects);
  }

  public getRemovedObjects(): readonly WorldObject[] {
    return Array.from(this.removed);
  }
}

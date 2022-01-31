import { StepInfo } from './types';
import { AbstractWorldObject } from './worldObject';

/**
 * The world contains all of your world objects and their components.
 */
export abstract class AbstractWorld {
  private lastStep?: number;

  private readonly objects: Set<AbstractWorldObject>;
  private readonly removed: Set<AbstractWorldObject>;

  constructor() {
    this.objects = new Set();
    this.removed = new Set();
  }

  /**
   * Adds an object to the world.
   *
   * @param object The target object.
   */
  public add<T extends AbstractWorldObject>(object: T): T {
    this.objects.add(object);

    object.onAdded(this);

    return object;
  }

  /**
   * Flags the target object for removal at the conclusion of the next `step()`
   * or explicit call to `purge()`.
   *
   * @param object The target object.
   */
  public remove(object: AbstractWorldObject): void {
    this.removed.add(object);
  }

  /**
   * Determine whether the target object will be removed at the conclusion of
   * the next `step()` or explicit call to `purge()`.
   *
   * @param object The target object.
   */
  public willRemove(object: AbstractWorldObject): boolean {
    return this.removed.has(object);
  }

  /**
   * Determines whether or not the target object is included in this world.
   *
   * @param object The target object.
   */
  public contains(object: AbstractWorldObject): boolean {
    return this.objects.has(object);
  }

  /**
   * Immediately removes all objects marked for removal and resets the list.
   */
  public purge(): void {
    for (const object of this.removed) {
      if (this.objects.has(object)) {
        this.objects.delete(object);
        object.onRemoved(this);
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
      object.step(this, info);
    }

    // Purge any objects that were marked for removal in the previous batch of
    // object updates.
    this.purge();

    // Capture last step time.
    this.lastStep = Date.now();

    return info;
  }
}

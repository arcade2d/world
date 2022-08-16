import { MappedList } from '@arcade2d/utils';
import { Vector } from '.';
import { Component } from './component';
import { ComponentMountable } from './componentMountable';
import { Prefab } from './prefab';
import { StepInfo } from './types';
import { WorldObject, WorldObjectSavedState } from './worldObject';

export interface WorldComponent extends Component<World> {}

export type WorldOptions = {
  readonly components: (owner: World) => readonly WorldComponent[];
};

export type WorldQuery = (object: WorldObject) => boolean;

/**
 * The world contains all of your world objects and their components.
 */
export class World extends ComponentMountable<World> {
  private lastStep?: number;
  private lastId: number = 0;
  private _destroyed: boolean = false;

  public readonly options: WorldOptions;

  private readonly queryable: Set<WorldObject> = new Set();
  private readonly objects: MappedList<number, WorldObject> = new MappedList();

  constructor(options: Partial<WorldOptions> = {}) {
    super(options.components ?? (() => []));

    this.options = { components: () => [], ...options };
  }

  public create(prefab: Prefab, position?: Vector): WorldObject {
    const id = ++this.lastId;
    const object = new WorldObject(this, id, prefab);

    if (position) {
      object.position.set(position);
    }

    this.objects.add(object.id, object);

    if (prefab.options.queryable) {
      this.queryable.add(object);
    }

    return object;
  }

  /**
   * Destroys all of the objects and components owned by this world.
   */
  public destroy(): void {
    if (!this._destroyed) {
      for (const { value: object } of this.objects) {
        object.destroy();
      }

      for (const [_, component] of this.components) {
        if (component.destroy) {
          component.destroy();
        }
      }

      this._destroyed = true;
    }
  }

  /**
   * @internal
   */
  public __remove(object: WorldObject): void {
    this.objects.remove(object.id);

    if (object.prefab.options.queryable) {
      this.queryable.delete(object);
    }
  }

  /**
   * Step through the world simulation. This method does the following in
   * sequence:
   *
   * 1. Produces a new `StepInfo` instance with delta time calculated.
   * 2. Calls the `step()` method on event component attached to the world and
   * passed down the `StepInfo` that was generated.
   * 3. Calls the `step()` method on every world object within the world and
   * passes down the `StepInfo` that was generated.
   * 4. Returns the `StepInfo`.
   */
  public step(): StepInfo {
    const now = Date.now();

    const info: StepInfo = {
      previous: this.lastStep ?? now,
      current: now,
      delta: now - (this.lastStep ?? now),
    };

    for (const [_, component] of this.components) {
      if (component.step) {
        component.step(info);
      }
    }

    for (const { value: object } of this.objects) {
      object.step(info);
    }

    // Capture last step time.
    this.lastStep = Date.now();

    return info;
  }

  /**
   * Finds an object using its ID.
   *
   * @param id The ID of the object to find.
   */
  public findById(id: number): WorldObject | null {
    return this.objects.get(id);
  }

  /**
   * Find a single object matching the query function. Only checks objects
   * created from prefabs where `queryable` is true in its options.
   *
   * @param query The query function, which should return true for the object
   * being searched for.
   */
  public findOne(query: WorldQuery): WorldObject | null {
    for (const object of this.queryable) {
      if (query(object)) {
        return object;
      }
    }

    return null;
  }

  /**
   * Find all objects matching the query function. Only checks objects created
   * from prefabs where `queryable` is true in its options.
   *
   * @param query The query function, which should return true for the objects
   * being searched for.
   */
  public findMany(query: WorldQuery): readonly WorldObject[] {
    const result: WorldObject[] = [];

    for (const object of this.queryable) {
      if (query(object)) {
        result.push(object);
      }
    }

    return result;
  }

  public save(): readonly WorldObjectSavedState[] {
    return Array.from(this.objects).map(({ value }) => value.save());
  }

  public load(data: readonly WorldObjectSavedState[]): void {
    for (const entry of data) {
      const prefab = Prefab.getPrefabFromKey(entry.k);

      if (prefab) {
        const object = this.create(prefab, Vector.from(entry.p));
        object.load(entry);
      }
    }
  }
}

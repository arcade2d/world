import { Vector } from '../geom/vector';
import { StepInfo } from '../types';
import { World } from './world';
import { WorldObjectComponent } from './worldObjectComponent';

export type WorldObjectMetadata = {
  readonly queryable: boolean;
  readonly tags: readonly string[];
};

const defaultMetadataFactory = (): WorldObjectMetadata => ({
  queryable: false,
  tags: [],
});

export class WorldObject {
  private _id: number = 0;
  private _world: World | null = null;

  public readonly position: Vector;
  public readonly metadata: WorldObjectMetadata;

  private readonly components: Map<Function, WorldObjectComponent> = new Map();

  constructor(
    metadata?: Partial<WorldObjectMetadata>,
    components?: readonly WorldObjectComponent[],
  ) {
    this.position = new Vector();

    this.metadata = {
      ...defaultMetadataFactory(),
      ...metadata,
    };

    if (components) {
      for (const component of components) {
        this.addComponent(component);
      }
    }
  }

  /**
   * @internal
   *
   * Registers this object as added to a world.
   */
  public __register(world: World, id: number): void {
    this._world = world;
    this._id = id;
  }

  /**
   * @internal
   *
   * Deregisters this object from a world.
   */
  public __deregister(): void {
    this._world = null;
  }

  /**
   * @internal
   */
  public __step(world: World, info: StepInfo): void {
    this.step(world, info);

    for (const [_, component] of this.components) {
      component.step(world, this, info);
    }
  }

  public onAdd(world: World): void {}
  public onRemove(world: World): void {}
  public onPurge(world: World): void {}

  public step(world: World, info: StepInfo): void {}

  /**
   * Determine whether this object has an instance of the target component type.
   *
   * @param type The component type.
   */
  public hasComponent(type: new () => WorldObjectComponent): boolean {
    return this.components.has(type);
  }

  public getComponent<T extends new () => WorldObjectComponent>(
    type: T,
  ): T | null {
    const component = this.components.get(type);

    return component ? (component as unknown as T) : null;
  }

  public addComponent<T extends WorldObjectComponent>(component: T): T {
    if (this.components.has(component.constructor)) {
      throw new Error(
        `Object already has an instance of the component ${component.constructor.name}.`,
      );
    }

    this.components.set(component.constructor, component);

    return component;
  }

  public removeComponent(component: WorldObjectComponent): void {
    this.components.delete(component.constructor);
  }

  /**
   * The ID that this object was allocated the last time it was added to a
   * `World`, or `0` if it never was. Keeps the last non-zero value it was
   * allocated even if removed, but is provided a new one if it is re-added.
   */
  public get id(): number {
    return this._id;
  }

  /**
   * A reference to the `World` that this object belongs to, or `null` if none.
   */
  public get world(): World | null {
    return this._world;
  }
}

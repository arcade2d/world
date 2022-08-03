import { Vector } from '../geom/vector';
import { StepInfo } from '../types';
import { World } from './world';

export abstract class AbstractWorldObject {
  private _id: number = 0;
  private _world: World | null = null;

  public readonly position: Vector;

  constructor() {
    this.position = new Vector();
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

  public onAdd(world: World): void {}
  public onRemove(world: World): void {}
  public onPurge(world: World): void {}

  public step(world: World, info: StepInfo): void {}

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

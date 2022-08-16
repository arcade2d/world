import { Value as JSONValue } from 'json-typescript';
import { Component } from './component';
import { ComponentMountable } from './componentMountable';
import { Prefab } from './prefab';
import { StepInfo } from './types';
import { Vector } from './vector';
import { World } from './world';

export interface WorldObjectComponent extends Component<WorldObject> {}

export type WorldObjectSavedState = {
  readonly k: string;
  readonly p: [number, number];
  readonly c: Record<string, JSONValue>;
};

export class WorldObject extends ComponentMountable<WorldObject> {
  /**
   * The position of this object within the world, expressed as a 2D vector
   * position.
   */
  public readonly position: Vector;

  private _destroyed: boolean = false;

  constructor(
    /**
     * The `World` that created this object.
     */
    public readonly world: World,
    /**
     * The ID value assigned to this object at the time of creation, which will
     * be unique across its peers within a `World`.
     */
    public readonly id: number,
    /**
     * The `Prefab` that this object was created from.
     */
    public readonly prefab: Prefab,
  ) {
    super(prefab.options.components);

    this.position = new Vector();
  }

  /**
   * Destroy this object and remove it from the world that created it.
   */
  public destroy(): void {
    if (!this._destroyed) {
      for (const [_, component] of this.components) {
        if (component.destroy) {
          component.destroy();
        }
      }

      this.world.__remove(this);
      this._destroyed = true;
    }
  }

  public step(info: StepInfo): void {
    if (!this._destroyed) {
      for (const [_, component] of this.components) {
        if (component.step) {
          component.step(info);
        }
      }
    }
  }

  public save(): WorldObjectSavedState {
    return {
      k: this.prefab.key,
      p: this.position.toTuple(),
      c: Object.fromEntries(
        Array.from(this.components).map(([_, component]) => [
          component.constructor.name,
          component.save ? component.save() : null,
        ]),
      ),
    };
  }

  public load(data: WorldObjectSavedState): void {
    this.position.set(data.p);

    for (const type in data.c) {
      for (const [_, component] of this.components) {
        if (component.load && component.constructor.name === type) {
          component.load(data.c[type]);
        }
      }
    }
  }

  /**
   * Whether or not this object has been marked as destroyed.
   */
  public get destroyed(): boolean {
    return this._destroyed;
  }
}

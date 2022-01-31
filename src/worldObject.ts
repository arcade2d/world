import { Vector } from './geom/vector';
import { StepInfo } from './types';
import { World } from './world';

export class WorldObject {
  public readonly position: Vector;

  constructor() {
    this.position = new Vector();
  }

  public onAdd(world: World): void {}
  public onRemove(world: World): void {}
  public onPurge(world: World): void {}
  public step(world: World, info: StepInfo): void {}
}

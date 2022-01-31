import { StepInfo } from './types';
import { World } from './world';

export class WorldObject {
  public onAdd(world: World): void {}
  public onRemove(world: World): void {}
  public onPurge(world: World): void {}
  public step(world: World, info: StepInfo): void {}
}

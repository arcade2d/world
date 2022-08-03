import { StepInfo } from '../types';
import { World } from './world';
import { WorldObject } from './worldObject';

export class WorldObjectComponent {
  public step(world: World, object: WorldObject, info: StepInfo): void {}
}

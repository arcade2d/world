import { StepInfo } from './types';
import { AbstractWorld } from './world';

export abstract class AbstractWorldObject {
  public abstract onAdded(world: AbstractWorld): void;
  public abstract onRemoved(world: AbstractWorld): void;
  public abstract step(world: AbstractWorld, info: StepInfo): void;
}

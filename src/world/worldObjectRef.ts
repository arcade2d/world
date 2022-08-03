import { World } from './world';
import { AbstractWorldObject } from './worldObject';

export class WorldObjectRef<
  T extends AbstractWorldObject = AbstractWorldObject,
> {
  constructor(
    private readonly objects: Map<number, AbstractWorldObject>,
    public readonly world: World,
    public readonly id: number,
  ) {}

  /**
   * The target object, or `null` if that object has been removed from the world
   * that this reference was created through.
   */
  public get target(): T | null {
    const object = this.objects.get(this.id);

    return object && object.world === this.world ? (object as T) : null;
  }
}

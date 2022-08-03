import { World } from './world';
import { WorldObject } from './worldObject';

export class WorldObjectRef<T extends WorldObject = WorldObject> {
  constructor(
    private readonly objects: Map<number, WorldObject>,
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

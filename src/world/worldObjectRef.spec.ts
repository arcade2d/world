import { World } from './world';
import { WorldObject } from './worldObject';
import { WorldObjectRef } from './worldObjectRef';

class MyObject extends WorldObject {}

describe(WorldObjectRef.name, () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe('id', () => {
    test('It should permanently yield the ID associated with the target object.', () => {
      const object = world.add(new MyObject());
      const ref = world.getRef(object);

      expect(ref.id).toBe(object.id);
    });
  });

  describe('world', () => {
    test('It should reference the world that this ref was created from.', () => {
      const object = world.add(new MyObject());
      const ref = world.getRef(object);

      expect(ref.world).toBe(world);
    });
  });

  describe('target', () => {
    test('It should yield the target object originally provided to World.createRef().', () => {
      const object = world.add(new MyObject());
      const ref = world.getRef(object);

      expect(ref.target).toBe(object);
    });

    test('It should yield null if the target has been removed from the world.', () => {
      const object = world.add(new MyObject());
      const ref = world.getRef(object);

      world.remove(object);

      expect(ref.target).toBe(null);
    });
  });
});

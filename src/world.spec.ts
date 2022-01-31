import { WorldObject } from '.';
import { World } from './world';

describe('World', () => {
  let world = {} as World;

  beforeEach(() => {
    world = new World();

    jest.spyOn(world, 'purge');
  });

  describe('step', () => {
    test('Delta should be nil for the very first call.', () => {
      expect(world.step().delta).toEqual(0);
    });

    test('Delta should be a positive value for repeat calls.', (done) => {
      world.step();

      setTimeout(() => {
        expect(world.step().delta).toBeGreaterThan(0);
        done();
      }, 100);
    });

    test('purge() should be called at the end of each step call.', () => {
      world.step();
      world.step();

      expect(world.purge).toBeCalledTimes(2);
    });

    test('It should call step() on all included world objects using the generated StepInfo.', () => {
      const objectA = world.add(new WorldObject());
      const objectB = world.add(new WorldObject());

      jest.spyOn(objectA, 'step');
      jest.spyOn(objectB, 'step');

      const info = world.step();

      expect(objectA.step).toBeCalledWith(world, info);
      expect(objectB.step).toBeCalledWith(world, info);
    });
  });

  describe('add', () => {
    let object = {} as WorldObject;

    beforeEach(() => {
      object = new WorldObject();

      jest.spyOn(object, 'onAdd');
    });

    test('It should allow the addition of a world object.', () => {
      world.add(object);

      expect(object.onAdd).toBeCalledTimes(1);
      expect(world.getObjects()).toContain(object);
    });

    test('It should not acknowledge repeat calls to the same world object.', () => {
      world.add(object);
      world.add(object);
      world.add(object);

      expect(object.onAdd).toBeCalledTimes(1);
      expect(world.getObjects()).toHaveLength(1);
    });
  });
});

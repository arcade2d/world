import { Prefab } from './prefab';
import { World } from './world';

const SamplePrefab = Prefab.create('sample', {
  components: (owner) => [
    //
  ],
});

describe('World', () => {
  let world = {} as World;

  beforeEach(() => {
    world = new World();
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

    test('It should call step() on all included world objects using the generated StepInfo.', () => {
      const objectA = world.create(SamplePrefab);
      const objectB = world.create(SamplePrefab);

      jest.spyOn(objectA, 'step');
      jest.spyOn(objectB, 'step');

      const info = world.step();

      expect(objectA.step).toBeCalledWith(info);
      expect(objectB.step).toBeCalledWith(info);
    });
  });
});

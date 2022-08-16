import { Prefab } from './prefab';
import { Vector } from './vector';
import { World } from './world';
import { WorldObject, WorldObjectComponent } from './worldObject';

class ExampleComponent implements WorldObjectComponent {
  public test: string = 'hello';

  constructor(public readonly owner: WorldObject) {}

  public save() {
    return {
      test: this.test,
    };
  }

  public load(data: any) {
    this.test = data.test;
  }
}

const ExamplePrefab = Prefab.create('example', {
  components: (owner) => [new ExampleComponent(owner)],
});

describe(WorldObject.name, () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe(WorldObject.prototype.save.name, () => {
    test('It should return primitive data representing the state of the object and its components.', () => {
      const object = world.create(ExamplePrefab, Vector.from(150, 200));
      const data = object.save();

      expect(data.k).toBe('example');
      expect(data.p).toEqual([150, 200]);
      expect(data.c[ExampleComponent.name]).toEqual({
        test: 'hello',
      });
    });
  });

  describe(WorldObject.prototype.load.name, () => {
    test('It should apply save data to itself and its components.', () => {
      const object = world.create(ExamplePrefab);

      object.load({
        k: 'example',
        p: [20, 80],
        c: {
          [ExampleComponent.name]: {
            test: 'updated',
          },
        },
      });

      expect(object.position.toTuple()).toEqual([20, 80]);
      expect(object.getComponent(ExampleComponent).test).toBe('updated');
    });
  });
});

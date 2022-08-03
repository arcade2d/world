import { WorldObject } from './worldObject';
import { WorldObjectComponent } from './worldObjectComponent';

class ExampleComponent extends WorldObjectComponent {}
class AnotherExampleComponent extends WorldObjectComponent {}

describe(WorldObject.name, () => {
  test('A new instance can be created with metadata.', () => {
    const object = new WorldObject({
      queryable: true,
      tags: ['example'],
    });

    expect(object.metadata.queryable).toBeTruthy();
    expect(object.metadata.tags).toContain('example');
  });

  test('A new instance can be created with components.', () => {
    const object = new WorldObject({}, [new ExampleComponent()]);

    expect(object.hasComponent(ExampleComponent)).toBeTruthy();
    expect(object.hasComponent(AnotherExampleComponent)).toBeFalsy();
  });

  describe(WorldObject.prototype.getComponent.name, () => {
    test('It can correctly retrieve components.', () => {
      const object = new WorldObject({}, [
        new ExampleComponent(),
        new AnotherExampleComponent(),
      ]);
      const component = object.getComponent(AnotherExampleComponent);

      expect(component).toBeInstanceOf(AnotherExampleComponent);
    });

    test('It will return null for unowned components.', () => {
      const object = new WorldObject({}, [new ExampleComponent()]);
      const component = object.getComponent(AnotherExampleComponent);

      expect(component).toBeNull();
    });
  });

  describe(WorldObject.prototype.addComponent.name, () => {
    test('It can add a new component to an object.', () => {
      const object = new WorldObject();

      const component = object.addComponent(new AnotherExampleComponent());

      expect(object.getComponent(AnotherExampleComponent)).toBe(component);
      expect(object.hasComponent(AnotherExampleComponent)).toBeTruthy();
    });

    test('It will throw when attempting to add more than one of the same component.', () => {
      const object = new WorldObject();

      object.addComponent(new ExampleComponent());
      object.addComponent(new AnotherExampleComponent());

      expect(() => object.addComponent(new ExampleComponent())).toThrow();
    });
  });
});

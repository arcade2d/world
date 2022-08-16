import { Component } from './component';
import { ComponentMountable } from './componentMountable';

class MyComponent implements Component<any> {
  constructor(public readonly owner: any) {}
}

describe(ComponentMountable.name, () => {
  describe('constructor', () => {
    test('It can create components from an input component factory function.', () => {
      const mountable = new ComponentMountable<any>((owner) => [
        new MyComponent(owner),
      ]);

      expect(mountable.hasComponent(MyComponent)).toBeTruthy();
    });
  });

  describe(ComponentMountable.prototype.addComponent.name, () => {
    test('It can add a component to an existing instance.', () => {
      const mountable = new ComponentMountable(() => []);
      const component = mountable.addComponent(new MyComponent(mountable));

      expect(component.owner).toBe(mountable);
      expect(mountable.getComponent(MyComponent)).toBe(component);
    });
  });
});

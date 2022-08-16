import { Component, ComponentConstructor, ComponentFactory } from './component';

export class ComponentMountable<T> {
  protected readonly components: Map<Function, Component<T>> = new Map();

  constructor(factory: ComponentFactory<T>) {
    for (const component of factory(this as unknown as T)) {
      this.addComponent(component);
    }
  }

  /**
   * Retrieve the component matching the provided type.
   *
   * @param type The component type to fetch.
   */
  public getComponent<C extends Component<T>>(
    type: new (owner: T, ...args: readonly unknown[]) => C,
  ): C {
    const component = this.components.get(type);

    if (!component) {
      throw new Error(
        `Provider ${this} does not have a component of type ${type.name}.`,
      );
    }

    return component as unknown as C;
  }

  /**
   * Adds a new component to this object.
   *
   * @param component The component to add.
   */
  public addComponent(component: Component<T>): Component<T> {
    const type = component.constructor as ComponentConstructor<T>;

    if (this.hasComponent(type)) {
      throw new Error(`Mountable object already has component "${type.name}".`);
    }

    this.components.set(type, component);

    return component;
  }

  /**
   * Removes an existing component from this object.
   *
   * @param type The component type to remove.
   */
  public removeComponent(type: ComponentConstructor<T>): void {
    this.components.delete(type);
  }

  /**
   * Determine whether the target component exists for this instance.
   *
   * @param type The component type to check.
   */
  public hasComponent(type: ComponentConstructor<T>): boolean {
    return this.components.get(type) !== undefined;
  }
}

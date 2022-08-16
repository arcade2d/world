import { Value as JSONValue } from 'json-typescript';
import { StepInfo } from './types';

/**
 * A component can belong to an instance of `ComponentMountable`.
 */
export interface Component<T> {
  /**
   * The owner of this component.
   */
  readonly owner: T;

  /**
   * Called when the owner of this components is destroyed.
   */
  destroy?: () => void;

  /**
   * Called when the owner of this component is updated.
   */
  step?: (info: StepInfo) => void;

  save?: () => JSONValue;

  load?: (data: JSONValue) => void;
}

export type ComponentFactory<T> = (owner: T) => readonly Component<T>[];

export type ComponentConstructor<T = any> = new (
  owner: T,
  ...args: readonly unknown[]
) => Component<T>;

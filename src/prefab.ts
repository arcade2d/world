import { ComponentFactory } from './component';
import { WorldObject } from './worldObject';

export type PrefabOptions = {
  /**
   * Whether or not objects created from this prefab are queryable within a
   * world.
   */
  readonly queryable: boolean;

  /**
   * Tags that objects created from this prefab will be assigned for querying.
   */
  readonly tags: readonly string[];

  /**
   * Factory for providing components to new objects created from this prefab.
   */
  readonly components: ComponentFactory<WorldObject>;
};

export class Prefab {
  private static readonly registry: Map<Prefab, string> = new Map();

  /**
   * Creates a new prefab and registers it globally against the provided key.
   *
   * @param key The globally unique key.
   * @param options The prefab options.
   */
  public static create(
    key: string,
    options: Partial<PrefabOptions> = {},
  ): Prefab {
    if (this.hasKey(key)) {
      throw new Error(
        `Prefab registry already contains a prefab keyed "${key}".`,
      );
    }

    const prefab = new Prefab(options);

    this.registry.set(prefab, key);

    return prefab;
  }

  /**
   * Clears the registry of previously created prefabs.
   */
  public static clear(): void {
    this.registry.clear();
  }

  /**
   * Retrieve the key associated with the target prefab.
   *
   * @param prefab The target prefab.
   */
  public static getKey(prefab: Prefab): string {
    const result = this.registry.get(prefab);

    if (!result) {
      throw new Error(`Target prefab is unknown to the registry.`);
    }

    return result;
  }

  /**
   * Determine whether the input key has been registered for a prefab.
   *
   * @param key The key to check.
   */
  public static hasKey(key: string): boolean {
    return Array.from(this.registry.values()).includes(key);
  }

  public static getPrefabFromKey(key: string): Prefab | null {
    for (const [prefab, k] of this.registry) {
      if (k === key) {
        return prefab;
      }
    }

    return null;
  }

  public readonly options: PrefabOptions;

  private constructor(options: Partial<PrefabOptions> = {}) {
    this.options = {
      tags: [],
      queryable: false,
      components: () => [],
      ...options,
    };
  }

  public get key(): string {
    return Prefab.getKey(this);
  }
}

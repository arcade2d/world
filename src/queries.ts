import { WorldQuery } from '.';

/**
 * Creates a `WorldQuery` function that returns true for objects whose prefab is
 * keyed with the input key.
 *
 * @param key The prefab key.
 */
export const PrefabKeyQuery =
  (key: string): WorldQuery =>
  (object) =>
    object.prefab.key === key;

/**
 * Creates a `WorldQuery` function that returns true for objects that contain
 * the input tag in their tags list.
 *
 * @param tag The tag to search for.
 */
export const TagQuery =
  (tag: string): WorldQuery =>
  (object) =>
    object.prefab.options.tags.includes(tag);

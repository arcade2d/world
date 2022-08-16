import { Prefab } from '.';

describe(Prefab.name, () => {
  afterEach(() => {
    Prefab.clear();
  });

  describe(Prefab.create.name, () => {
    test('It will create a new prefab and register it against the provided key.', () => {
      const prefab = Prefab.create('test');

      expect(prefab).toBeInstanceOf(Prefab);
      expect(Prefab.getKey(prefab)).toBe('test');
    });

    test('It will throw for duplicate keys.', () => {
      Prefab.create('test');

      expect(() => Prefab.create('test')).toThrowError();
    });
  });

  describe(Prefab.getKey.name, () => {
    test('It will return the key assigned to a previously created prefab.', () => {
      const prefab = Prefab.create('example');

      expect(Prefab.getKey(prefab)).toBe('example');
    });
  });

  describe(Prefab.clear.name, () => {
    test('It will clear previously registered prefabs.', () => {
      Prefab.create('abc123');

      expect(Prefab.hasKey('abc123')).toBeTruthy();

      Prefab.clear();

      expect(Prefab.hasKey('abc123')).toBeFalsy();
    });
  });
});

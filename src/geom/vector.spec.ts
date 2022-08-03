import { normalizeVectorArgs, Vector } from './vector';

describe(normalizeVectorArgs.name, () => {
  test('It should normalize separate x and y input.', () => {
    const [x, y] = normalizeVectorArgs(10, 15);

    expect(x).toBe(10);
    expect(y).toBe(15);
  });

  test('It should normalize an input tuple.', () => {
    const [x, y] = normalizeVectorArgs([15, 20]);

    expect(x).toBe(15);
    expect(y).toBe(20);
  });

  test('It should normalize an input vector.', () => {
    const vector = new Vector(20, 25);
    const [x, y] = normalizeVectorArgs(vector);

    expect(x).toBe(vector.x);
    expect(y).toBe(vector.y);
  });
});

describe(Vector.name, () => {
  describe('constructor', () => {
    test('It should accept initial x and y values in the constructor.', () => {
      const vector = new Vector(10, 15);

      expect(vector.x).toBe(10);
      expect(vector.y).toBe(15);
    });

    test('It should be set to 0,0 when no constructor arguments are provided.', () => {
      const vector = new Vector();

      expect(vector.x).toBe(0);
      expect(vector.y).toBe(0);
    });
  });

  describe('x', () => {
    test('It will be equal to the last assigned value.', () => {
      const vector = new Vector(10, 15);
      vector.x = 20;

      expect(vector.x).toBe(20);
    });

    test('It will not be updated if the input is not a finite numeric value.', () => {
      const vector1 = new Vector(10, 15);
      const vector2 = new Vector('hello' as unknown as number, 20);

      vector1.x = 0 / 0;

      expect(vector1.x).toBe(10);
      expect(vector2.x).toBe(0);
    });
  });

  describe('y', () => {
    test('It will be equal to the last assigned value.', () => {
      const vector = new Vector(10, 15);
      vector.y = 20;

      expect(vector.y).toBe(20);
    });

    test('It will not be updated if the input is not a finite numeric value.', () => {
      const vector1 = new Vector(10, 15);
      const vector2 = new Vector(10, 'hello' as unknown as number);

      vector1.y = 0 / 0;

      expect(vector1.y).toBe(15);
      expect(vector2.y).toBe(0);
    });
  });

  describe(Vector.from.name, () => {
    test('It should be able to create a new Vector from separate x and y values.', () => {
      const vector = Vector.from(10, 15);

      expect(vector.x).toBe(10);
      expect(vector.y).toBe(15);
    });

    test('It should be able to create a new Vector from a tuple.', () => {
      const vector = Vector.from([15, 20]);

      expect(vector.x).toBe(15);
      expect(vector.y).toBe(20);
    });

    test('It should be able to create a new Vector from an input vector.', () => {
      const origin = new Vector(20, 25);
      const vector = Vector.from(origin);

      expect(vector.x).toBe(20);
      expect(vector.y).toBe(25);
    });
  });

  describe(Vector.prototype.interpolate.name, () => {
    test('It should interpolate between itself and the target at the given fraction amount.', () => {
      const vector = Vector.from(10, 20).interpolate(20, 40, 0.5);

      expect(Math.round(vector.x)).toBe(15);
      expect(Math.round(vector.y)).toBe(30);
    });
  });
});

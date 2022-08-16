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

  describe('toString', () => {
    test('It should return a string in the format Vector(x,y)', () => {
      const vector = new Vector(17, 14);

      expect(vector.toString()).toBe('Vector(17,14)');
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

  describe('angle', () => {
    test('It will return the angle of the vector.', () => {
      const vector = new Vector(30, 17);

      expect(vector.angle).toBe(Math.atan2(vector.y, vector.x));
    });
  });

  describe('length', () => {
    test('It will return the length of the vector.', () => {
      const vector = new Vector(10, 10);

      expect(vector.length).toBe(Math.sqrt(vector.x ** 2 + vector.y ** 2));
    });
  });

  describe(Vector.zero.name, () => {
    test('It will create a new vector at 0,0.', () => {
      const vector = Vector.zero();

      expect(vector.x).toBe(0);
      expect(vector.y).toBe(0);
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

  describe(Vector.up.name, () => {
    test('It should return an "upward facing" vector of 0,-1.', () => {
      const vector = Vector.up();

      expect(vector.x).toBe(0);
      expect(vector.y).toBe(-1);
    });
  });

  describe(Vector.down.name, () => {
    test('It should return a "downward facing" vector of 0,1.', () => {
      const vector = Vector.down();

      expect(vector.x).toBe(0);
      expect(vector.y).toBe(1);
    });
  });

  describe(Vector.left.name, () => {
    test('It should return a "left facing" vector of -1,0.', () => {
      const vector = Vector.left();

      expect(vector.x).toBe(-1);
      expect(vector.y).toBe(0);
    });
  });

  describe(Vector.right.name, () => {
    test('It should return a "right facing" vector of 1,0.', () => {
      const vector = Vector.right();

      expect(vector.x).toBe(1);
      expect(vector.y).toBe(0);
    });
  });

  describe(Vector.angular.name, () => {
    test('It should return a vector where x and y indicate the input angle.', () => {
      const vector = Vector.angular(Math.PI);

      expect(vector.x).toBe(Math.cos(Math.PI));
      expect(vector.y).toBe(Math.sin(Math.PI));
    });
  });

  describe(Vector.prototype.set.name, () => {
    test('It should allow new x and y values to be set from separate input.', () => {
      const vector = new Vector();
      vector.set(10, 15);

      expect(vector.x).toBe(10);
      expect(vector.y).toBe(15);
    });

    test('It should allow new x and y values to be set from a tuple.', () => {
      const vector = Vector.zero().set([10, 15]);

      expect(vector.x).toBe(10);
      expect(vector.y).toBe(15);
    });

    test('It should allow new x and y values to be set from an input vector.', () => {
      const vector = Vector.zero().set(Vector.from(15, 20));

      expect(vector.x).toBe(15);
      expect(vector.y).toBe(20);
    });
  });

  describe(Vector.prototype.distanceTo.name, () => {
    test('It can measure the distance to another position.', () => {
      const vector1 = Vector.from(10, 0);
      const vector2 = Vector.from(20, 0);

      expect(vector1.distanceTo(vector2)).toBe(10);
      expect(vector1.distanceTo(40, 18)).toBe(Math.sqrt(30 ** 2 + 18 ** 2));
    });
  });

  describe(Vector.prototype.angleTo.name, () => {
    test('It can measure the angle between itself and another position.', () => {
      const vector1 = Vector.from(10, 17);
      const vector2 = Vector.from(20, 38);

      expect(vector1.angleTo(vector2)).toBe(
        Math.atan2(vector2.y - vector1.y, vector2.x - vector1.x),
      );
    });
  });

  describe(Vector.prototype.toTuple.name, () => {
    test('It can return the vector as a tuple [x,y].', () => {
      expect(Vector.from(17, 32).toTuple()).toStrictEqual([17, 32]);
    });
  });

  describe(Vector.prototype.toPrimitive.name, () => {
    test('It can return a primitive representation of the vector as { x, y }.', () => {
      expect(Vector.from(9, 14).toPrimitive()).toStrictEqual({ x: 9, y: 14 });
    });
  });

  describe(Vector.prototype.toImmutablePrimitive.name, () => {
    test('It can return an immutable primitive representation of the vector as { x, y }.', () => {
      const result = Vector.from(177, 314).toImmutablePrimitive();

      expect(result.x).toBe(177);
      expect(result.y).toBe(314);

      // @ts-ignore
      expect(() => (result.x = 10)).toThrow();
      // @ts-ignore
      expect(() => (result.y = 10)).toThrow();
    });
  });

  describe(Vector.prototype.interpolate.name, () => {
    test('It should interpolate between itself and the target at the given fraction amount.', () => {
      const vector = Vector.from(10, 20).interpolate(20, 40, 0.5);

      expect(Math.round(vector.x)).toBe(15);
      expect(Math.round(vector.y)).toBe(30);
    });
  });

  describe(Vector.prototype.clone, () => {
    test('It should produce a clone of the current vector.', () => {
      const vector = new Vector(10, 15);
      const clone = vector.clone();

      expect(clone.x).toBe(vector.x);
      expect(clone.y).toBe(vector.y);
    });

    test('The clone should not reference the original vector.', () => {
      const vector = new Vector(10, 15);
      const clone = vector.clone();

      vector.set(20, 40);
      clone.set(5, 10);

      expect(clone.x).toBe(5);
      expect(clone.y).toBe(10);
      expect(vector.x).toBe(20);
      expect(vector.y).toBe(40);
    });
  });
});

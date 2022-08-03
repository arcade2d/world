export type VectorTuple = [number, number];

export interface VectorPrimitive {
  /**
   * The x value of this vector.
   */
  x: number;

  /**
   * The y value of this vector.
   */
  y: number;
}

/**
 * Normalize input arguments typically seen for an overloaded method into a
 * tuple `[x, y]`. This helps write function overloads like the following:
 *
 * ```
 * function example(x: number, y: number): void;
 * function example(tuple: [number, number]): void;
 * function example(vector: Vector): void;
 *
 * function example(a: number | [number, number] | Vector, b?: number): void {
 *   const [x, y] = normalizeVectorArgs(a, b);
 *
 *   // your code
 * }
 * ```
 *
 * @param a The x value, vector primitive or vector tuple.
 * @param b The optional y value.
 */
export function normalizeVectorArgs(
  a: VectorPrimitive | VectorTuple | number,
  b?: number,
): VectorTuple {
  if (typeof a === 'number') {
    return [a, b ?? 0];
  }

  if (Array.isArray(a)) {
    return a;
  }

  return [a.x, a.y];
}

export class Vector implements VectorPrimitive {
  /**
   * Creates a new vector from separate `x` and `y` arguments.
   *
   * @param x The initial `x` value.
   * @param y The initial `y` value.
   */
  public static from(x: number, y: number): Vector;

  /**
   * Creates a new vector based on the target vector.
   *
   * @param primitive The target vector.
   */
  public static from(primitive: VectorPrimitive): Vector;

  /**
   * Creates a new vector based on the input tuple of `[x, y]`.
   *
   * @param tuple The input tuple.
   */
  public static from(tuple: VectorTuple): Vector;

  public static from(
    a: number | VectorPrimitive | VectorTuple,
    b?: number,
  ): Vector {
    const [x, y] = normalizeVectorArgs(a, b);

    return new Vector(x, y);
  }

  /**
   * Creates a new vector of 0, -1.
   */
  public static up(): Vector {
    return new Vector(0, -1);
  }

  /**
   * Creates a new vector of 0, 1.
   */
  public static down(): Vector {
    return new Vector(0, 1);
  }

  /**
   * Creates a new vector of -1, 0.
   */
  public static left(): Vector {
    return new Vector(-1, 0);
  }

  /**
   * Creates a new vector of 1, 0.
   */
  public static right(): Vector {
    return new Vector(1, 0);
  }

  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * Creates and returns a new vector where `x` and `y` are equivalent to this
   * origin vector.
   */
  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
   * Update this vector to the input `x` and `y` values.
   *
   * @param x The new x value.
   * @param y The new y value.
   */
  public set(x: number, y: number): this;

  /**
   * Update this vector to match the input tuple.
   *
   * @param tuple The target tuple.
   */
  public set(tuple: VectorTuple): this;

  /**
   * Update this vector to match the target vector.
   *
   * @param primitive The target vector to update to.
   */
  public set(primitive: VectorPrimitive): this;

  public set(a: VectorPrimitive | VectorTuple | number, b?: number): this {
    const [x, y] = normalizeVectorArgs(a, b);

    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * Determine the distance between this vector and a set of separate `x` and
   * `y` values.
   *
   * @param x The x value to measure distance to.
   * @param y The y value to measure distance to.
   */
  public distanceTo(x: number, y: number): number;

  /**
   * Determine the distance between this vector and a tuple `[x, y]`.
   *
   * @param tuple The target tuple.
   */
  public distanceTo(tuple: VectorTuple): number;

  /**
   * Determine the distance between this vector and a target vector.
   *
   * @param primitive The target vector.
   */
  public distanceTo(primitive: VectorPrimitive): number;

  public distanceTo(
    a: VectorPrimitive | VectorTuple | number,
    b?: number,
  ): number {
    const [x, y] = normalizeVectorArgs(a, b);

    const dx = x - this.x;
    const dy = y - this.y;

    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  /**
   * Determine the angle between this vector and a set of separate `x` and `y`
   * values.
   *
   * @param x The x value.
   * @param y The y value.
   */
  public angleTo(x: number, y: number): number;

  /**
   * Determine the angle between this vector and a tuple `[x, y]`.
   *
   * @param tuple The target tuple.
   */
  public angleTo(tuple: VectorTuple): number;

  /**
   * Determine the angle between this vector and a target vector.
   *
   * @param primitive The target vector.
   */
  public angleTo(primitive: VectorPrimitive): number;

  public angleTo(
    a: VectorPrimitive | VectorTuple | number,
    b?: number,
  ): number {
    const [x, y] = normalizeVectorArgs(a, b);

    const dx = x - this.x;
    const dy = y - this.y;

    return Math.atan2(dy, dx);
  }

  /**
   * Returns a representation of this vector as a tuple of `[x, y]`.
   */
  public toTuple(): VectorTuple {
    return [this.x, this.y];
  }

  /**
   * Returns a representation of this vector as a primitive object of
   * `{ x, y }`.
   */
  public toPrimitive(): VectorPrimitive {
    return { x: this.x, y: this.y };
  }

  /**
   * Determine whether this vector matches the input `x` and `y` values.
   *
   * @param x The x value.
   * @param y The y value.
   */
  public equals(x: number, y: number): boolean;

  /**
   * Determine whether this vector matches the input tuple `[x, y]`.
   *
   * @param tuple The target tuple.
   */
  public equals(tuple: VectorTuple): boolean;

  /**
   * Determine whether this vector matches the target vector.
   *
   * @param primitive The target vector.
   */
  public equals(primitive: VectorPrimitive): boolean;

  public equals(
    a: VectorPrimitive | VectorTuple | number,
    b?: number,
  ): boolean {
    const [x, y] = normalizeVectorArgs(a, b);

    return x === this.x && y === this.y;
  }

  /**
   * Creates a new vector where the x and y values are a product of the input
   * value.
   *
   * @param value The value to multiply x and y by.
   */
  public multiply(value: number): Vector {
    return new Vector(this.x * value, this.y * value);
  }

  /**
   * Creates a new vector where the `x` and `y` values are divided by the input
   * value.
   *
   * @param value The amount to divide by.
   */
  public divide(value: number): Vector {
    return new Vector(this.x / value, this.y / value);
  }

  public add(x: number, y: number): Vector;
  public add(tuple: VectorTuple): Vector;
  public add(primitive: VectorPrimitive): Vector;

  public add(a: VectorPrimitive | VectorTuple | number, b?: number): Vector {
    const [x, y] = normalizeVectorArgs(a, b);

    return new Vector(this.x + x, this.y + y);
  }

  public subtract(x: number, y: number): Vector;
  public subtract(tuple: VectorTuple): Vector;
  public subtract(primitive: VectorPrimitive): Vector;

  public subtract(
    a: VectorPrimitive | VectorTuple | number,
    b?: number,
  ): Vector {
    const [x, y] = normalizeVectorArgs(a, b);

    return new Vector(this.x - x, this.y - y);
  }

  public interpolate(x: number, y: number, fraction: number): Vector;
  public interpolate(tuple: VectorTuple, fraction: number): Vector;
  public interpolate(primitive: VectorPrimitive, fraction: number): Vector;

  public interpolate(
    a: VectorPrimitive | VectorTuple | number,
    b: number,
    c?: number,
  ): Vector {
    const [x, y] = normalizeVectorArgs(a, b);

    const fraction = c ?? b;
    const angle = this.angleTo(x, y);
    const distance = this.distanceTo(x, y) * fraction;

    return new Vector(
      this.x + Math.cos(angle) * distance,
      this.y + Math.sin(angle) * distance,
    );
  }

  /**
   * Determine the magnitude or length of this vector.
   */
  public get magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Determine the angle of this vector in radians.
   */
  public get angle(): number {
    return Math.atan2(this.y, this.x);
  }
}

export type VectorTuple = [number, number];

export type ImmutableVectorPrimitive = {
  readonly x: number;
  readonly y: number;
};

export interface VectorPrimitive {
  /**
   * The horizontal value of this vector.
   */
  x: number;

  /**
   * The vertical value of this vector.
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
   * Creates a new Vector at `0,0`.
   */
  public static zero(): Vector {
    return new Vector(0, 0);
  }

  /**
   * Creates a new vector of `0,-1`, representing an "upward facing" magnitude.
   */
  public static up(): Vector {
    return new Vector(0, -1);
  }

  /**
   * Creates a new vector of `0,1`, representing a "downward facing" magnitude.
   */
  public static down(): Vector {
    return new Vector(0, 1);
  }

  /**
   * Creates a new vector of `-1,0`, representing a "left facing" magnitude.
   */
  public static left(): Vector {
    return new Vector(-1, 0);
  }

  /**
   * Creates a new vector of `1,0`, representing a "right facing" magnitude.
   */
  public static right(): Vector {
    return new Vector(1, 0);
  }

  /**
   * Creates a new vector where the `x` and `y` values indicate a direction
   * specified by input radians, starting from `1,0`.
   *
   * @param radians The angle in radians.
   */
  public static angular(radians: number): Vector {
    return new Vector(Math.cos(radians), Math.sin(radians));
  }

  private _x: number = 0;
  private _y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public toString(): string {
    return `Vector(${this._x},${this._y})`;
  }

  /**
   * Creates and returns a new vector where `x` and `y` are equivalent to this
   * origin vector.
   */
  public clone(): Vector {
    return new Vector(this._x, this._y);
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

    const dx = x - this._x;
    const dy = y - this._y;

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

    const dx = x - this._x;
    const dy = y - this._y;

    return Math.atan2(dy, dx);
  }

  /**
   * Returns a representation of this vector as a tuple of `[x, y]`.
   */
  public toTuple(): VectorTuple {
    return [this._x, this._y];
  }

  /**
   * Returns a representation of this vector as a primitive object of
   * `{ x, y }`.
   */
  public toPrimitive(): VectorPrimitive {
    return { x: this._x, y: this._y };
  }

  /**
   * Returns a readonly representation of this vector as a primitive object of
   * `{ x, y }`;
   */
  public toImmutablePrimitive(): ImmutableVectorPrimitive {
    const value = {};

    Object.defineProperties(value, {
      x: {
        value: this._x,
        writable: false,
      },
      y: {
        value: this._y,
        writable: false,
      },
    });

    return value as ImmutableVectorPrimitive;
  }

  /**
   * Determine whether this vector matches the input `x` and `y` values.
   *
   * @param x The x value.
   * @param y The y value.
   * @param precision Precision to check equality. For example, a precision of
   * 0.5 would mean vectors at 0,1 and 0,1.4 would be considered equal.
   */
  public equals(x: number, y: number, precision?: number): boolean;

  /**
   * Determine whether this vector matches the input tuple `[x, y]`.
   *
   * @param tuple The target tuple.
   * @param precision Precision to check equality. For example, a precision of
   * 0.5 would mean vectors at 0,1 and 0,1.4 would be considered equal.
   */
  public equals(tuple: VectorTuple, precision?: number): boolean;

  /**
   * Determine whether this vector matches the target vector.
   *
   * @param primitive The target vector.
   * @param precision Precision to check equality. For example, a precision of
   * 0.5 would mean vectors at 0,1 and 0,1.4 would be considered equal.
   */
  public equals(primitive: VectorPrimitive, precision?: number): boolean;

  public equals(
    a: VectorPrimitive | VectorTuple | number,
    b?: number,
    c?: number,
  ): boolean {
    const [x, y] = normalizeVectorArgs(a, b);

    const precision = c ?? b;

    if (precision) {
      const tx = Math.floor(this.x / precision) * precision;
      const ty = Math.floor(this.y / precision) * precision;
      const dx = Math.floor(x / precision) * precision;
      const dy = Math.floor(y / precision) * precision;

      return tx === dx && ty === dy;
    }

    return x === this._x && y === this._y;
  }

  /**
   * Creates a new vector where the x and y values are a product of the input
   * value.
   *
   * @param value The value to multiply x and y by.
   */
  public multiply(value: number): Vector {
    return new Vector(this._x * value, this._y * value);
  }

  /**
   * Creates a new vector where the `x` and `y` values are divided by the input
   * value.
   *
   * @param value The amount to divide by.
   */
  public divide(value: number): Vector {
    return new Vector(this._x / value, this._y / value);
  }

  /**
   * Creates a new vector where `x` and `y` are increased by the input values.
   *
   * @param x The input x value.
   * @param y The input y value.
   */
  public add(x: number, y: number): Vector;

  /**
   * Creates a new vector where `x` and `y` are increased by the respective
   * values in the input tuple.
   *
   * @param tuple The input tuple.
   */
  public add(tuple: VectorTuple): Vector;

  /**
   * Creates a new vector where `x` and `y` are increased by the respective
   * values in the input vector.
   *
   * @param primitive The input vector.
   */
  public add(primitive: VectorPrimitive): Vector;

  public add(a: VectorPrimitive | VectorTuple | number, b?: number): Vector {
    const [x, y] = normalizeVectorArgs(a, b);

    return new Vector(this._x + x, this._y + y);
  }

  /**
   * Creates a new vector where `x` and `y` are decreased by the input values.
   *
   * @param x The x value.
   * @param y The y value.
   */
  public subtract(x: number, y: number): Vector;

  /**
   * Creates a new vector where the `x` and `y` are decreased by the respective
   * values in the input tuple.
   *
   * @param tuple The input tuple.
   */
  public subtract(tuple: VectorTuple): Vector;

  /**
   * Creates a new vector where the `x` and `y` are decreased by the respective
   * values in the input vector.
   *
   * @param primitive The input vector.
   */
  public subtract(primitive: VectorPrimitive): Vector;

  public subtract(
    a: VectorPrimitive | VectorTuple | number,
    b?: number,
  ): Vector {
    const [x, y] = normalizeVectorArgs(a, b);

    return new Vector(this._x - x, this._y - y);
  }

  /**
   * Creates a new vector where the `x` and `y` are interpolated by `fraction`
   * between this vector and the target `x` and `y` values.
   *
   * @param x The target x value.
   * @param y The target y value.
   * @param fraction The fraction of distance that should be interpolated. For
   * example, 0.5 would yield a new vector that is half way between this vector
   * and the target.
   */
  public interpolate(x: number, y: number, fraction: number): Vector;

  /**
   * Creates a new vector where the `x` and `y` are interpolated by `fraction`
   * between this vector and the respective values in the target tuple.
   *
   * @param tuple The target tuple.
   * @param fraction The fraction of distance that should be interpolated. For
   * example, 0.5 would yield a new vector that is half way between this vector
   * and the target.
   */
  public interpolate(tuple: VectorTuple, fraction: number): Vector;

  /**
   * Creates a new vector where the `x` and `y` are interpolated by `fraction`
   * between this vector and the respective values in the target vector.
   *
   * @param primitive The target vector.
   * @param fraction The fraction of distance that should be interpolated. For
   * example, 0.5 would yield a new vector that is half way between this vector
   * and the target.
   */
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
      this._x + Math.cos(angle) * distance,
      this._y + Math.sin(angle) * distance,
    );
  }

  /**
   * Creates a new vector where the `x` and `y` values are altered by `distance`
   * along the angle between this vector and the target `x` and `y` values.
   *
   * @param x The target x value.
   * @param y The target y value.
   * @param distance The distance to move along the line between this vector
   * and the target.
   */
  public moveToward(x: number, y: number, distance: number): Vector;

  /**
   * Creates a new vector where the `x` and `y` values are altered by `distance`
   * along the angle between this vector and the respective values within the
   * target tuple.
   *
   * @param tuple The target tuple.
   * @param distance The distance to move along the line between this vector
   * and the target.
   */
  public moveToward(tuple: VectorTuple, distance: number): Vector;

  /**
   * Creates a new vector where the `x` and `y` values are altered by `distance`
   * along the angle between this vector and the respective values within the
   * target vector.
   *
   * @param primitive The target vector.
   * @param distance The distance to move along the line between this vector
   * and the target.
   */
  public moveToward(primitive: VectorPrimitive, distance: number): Vector;

  public moveToward(
    a: VectorPrimitive | VectorTuple | number,
    b: number,
    c?: number,
  ): Vector {
    const [x, y] = normalizeVectorArgs(a, b);

    const distance = c ?? b;
    const angle = this.angleTo(x, y);

    return new Vector(
      this._x + Math.cos(angle) * distance,
      this._y + Math.sin(angle),
    );
  }

  /**
   * Creates a new Vector placed along the angle of this vector at the specified
   * distance. For example, given a vector 1,0 which is facing directly to the
   * right, `traverse(5)` would produce a new vector 6,0.
   *
   * @param distance The distance to traverse along the angle implied by this
   * vector.
   */
  public traverse(distance: number): Vector {
    return new Vector(
      this.x + Math.cos(this.angle) * distance,
      this.y + Math.sin(this.angle) * distance,
    );
  }

  /**
   * Creates a new vector where the current position is "snapped" to the nearest
   * cell corner in an abstract grid as defined by the input `x` and `y` values.
   *
   * @param x The x spacing between the grid columns.
   * @param y The y spacing between the grid rows.
   */
  public snap(x: number, y: number): Vector {
    return new Vector(Math.round(this.x / x) * x, Math.round(this.y / y) * y);
  }

  /**
   * Determine the magnitude or length of this vector.
   */
  public get length(): number {
    return Math.sqrt(this._x ** 2 + this._y ** 2);
  }

  /**
   * Determine the angle of this vector in radians.
   */
  public get angle(): number {
    return Math.atan2(this._y, this._x);
  }

  public get x(): number {
    return this._x;
  }

  public set x(value: number) {
    this._x = Number.isFinite(value) ? value : this._x;
  }

  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    this._y = Number.isFinite(value) ? value : this._y;
  }
}

export interface VectorLike {
  x: number;
  y: number;
}

export class Vector implements VectorLike {
  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * Update the x and y values of this vector.
   *
   * @param x The new x value.
   * @param y The new y value.
   */
  public set(x: number, y: number): this;

  /**
   * Update the x and y values of this vector.
   *
   * @param value The target vector to update to.
   */
  public set(value: Vector): this;

  public set(a: Vector | number, b?: number): this {
    const value = this.normalizeArgs(a, b);

    this.x = value.x;
    this.y = value.y;

    return this;
  }

  private normalizeArgs(a: Vector | number, b?: number): VectorLike {
    if (typeof a === 'number') {
      return { x: a, y: b ?? 0 };
    }

    return a;
  }
}

/**
 * Stores information about the space between two calls to `step()` within a
 * `World` instance.
 */
export type StepInfo = {
  /**
   * Unix timestamp that the previous step was triggered at.
   */
  readonly previous: number;

  /**
   * Unix timestamp that the current step was triggered at.
   */
  readonly current: number;

  /**
   * Milliseconds between the previous step and the current one, used for any
   * time-sensitive calculations.
   */
  readonly delta: number;
};

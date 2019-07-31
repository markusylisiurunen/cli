/**
 * @overview UI view: Base class to extend from.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export default abstract class UIView<State = any> {
  // Parent UI view if any
  private parent: UIView | null = null;

  // Internal state for the UI view
  protected state: State;

  /**
   * @constructor
   * @param parent Parent UI view if not at top-level view.
   */
  protected constructor(parent: UIView | null) {
    if (parent) {
      this.parent = parent;
    }

    this.state = {} as any;
  }

  /**
   * Method for the child to request a re-render.
   * @param child Reference to the child view.
   */
  protected requestRender(): void {}

  /**
   * Update the internal state of the component.
   * @param nextState New state or parts of it.
   */
  protected setState(nextState: Partial<State>): void {
    this.state = { ...this.state, ...nextState };

    if (this.parent) {
      this.parent.requestRender();
    } else {
      this.reset();
      this.render();
    }
  }

  /**
   * Reset the currently rendered view.
   */
  public abstract reset(): void;

  /**
   * Render the view.
   */
  public abstract render(): void;
}

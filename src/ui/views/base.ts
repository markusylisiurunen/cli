/**
 * @overview UI view: Base class every other view must extend from.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export default abstract class UIViewBase<State = any> {
  // References to parent and child views if any
  protected parent: UIViewBase | null = null;
  protected child: UIViewBase | null = null;

  // Internal state for the view
  protected state: State = {} as any;

  /**
   * @constructor
   * @param parent Parent view if this view is not the root view.
   */
  protected constructor(parent: UIViewBase | null = null) {
    if (parent !== null) {
      this.parent = parent;
      this.parent.registerChildView(this);
    }
  }

  /**
   * Register a child view.
   * @param child Reference to the child view.
   */
  protected registerChildView(child: UIViewBase): void {
    this.child = child;
  }

  /**
   * Method for the child to request a re-render from the parent.
   */
  protected requestReRender(): void {}

  /**
   * Update the internal state of the view.
   * @param nextState New (partial) state.
   */
  protected setState(nextState: Partial<State>): void {
    this.state = { ...this.state, ...nextState };

    if (this.parent !== null) {
      this.parent.requestReRender();
    }
  }

  /**
   * Determines whether this view requests initialise step or not.
   */
  public shouldInitialise(): boolean {
    return false;
  }

  /**
   * Initialise the view. This will be called only once when the view is created.
   */
  public async initialise(): Promise<void> {}

  /**
   * Render the view. The render always starts from an empty line and it must end on an empty line.
   * In other words, the render method only adds lines in between the cursor's initial position and
   * the final position but the cursor must be at the start of a new line at both times.
   *
   * This method must return the number of rendered lines. This is can be calculated with the
   * following formula.
   *
   * rowIndexAtEnd - rowIndexAtStart
   */
  public abstract render(): number;
}

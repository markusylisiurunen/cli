/**
 * @overview UI View: Log message.
 */

import { terminal } from "terminal-kit";

import UIViewBase from "@/ui/views/base";

/**
 * Interface for the view's props.
 */
export interface IUIViewLogProps {
  text: string;
}

/**
 * Interface for the view's default options.
 */
export interface IUIViewLogOptions {}

/**
 * Interface for the view's internal state.
 */
interface IUIViewLogState {
  text: string;
}

class UIViewLog extends UIViewBase<IUIViewLogState> {
  /**
   * Construct a new log view.
   * @constructor
   * @param parent  Parent view to communicate with.
   * @param props   Properties for the view.
   * @param options Options for the view.
   */
  public constructor(
    parent: UIViewBase,
    props: IUIViewLogProps,
    _options: Partial<IUIViewLogOptions>,
  ) {
    super(parent);
    this.state = { text: props.text };
  }

  /**
   * Render the view.
   */
  public render(): number {
    const lineCount = this.state.text.split("\n").length;

    terminal(`${this.state.text}\n`);

    return lineCount;
  }
}

export default UIViewLog;

/**
 * @overview UI Question View: Prompt for a boolean value.
 */

import { terminal } from "terminal-kit";
import inquirer from "inquirer";

import UIViewBase from "@/ui/views/base";

/**
 * Interface for the view's props.
 */
export interface IUIQuestionViewBooleanProps {
  question: string;
}

/**
 * Interface for the view's default options.
 */
export interface IUIQuestionViewBooleanOptions {}

/**
 * Interface for the view's internal state.
 */
interface IUIQuestionViewBooleanState {
  question: string;
  value: boolean | null;
}

class UIQuestionViewBoolean extends UIViewBase<IUIQuestionViewBooleanState> {
  /**
   * Construct a new boolean question view.
   * @constructor
   * @param parent  Parent view to communicate with.
   * @param props   Properties for the view.
   * @param options Options for the view.
   */
  public constructor(
    parent: UIViewBase | null,
    props: IUIQuestionViewBooleanProps,
    _options: Partial<IUIQuestionViewBooleanOptions>,
  ) {
    super(parent);
    this.state = { question: props.question, value: null };
  }

  /**
   * Reset after the initialise question.
   */
  private resetInitialise(): void {
    terminal.column(0);
    terminal.move(0, -1);
    terminal.eraseLine();
  }

  /**
   * Get the input value.
   */
  public getValue(): boolean | null {
    return this.state.value;
  }

  /**
   * Activate initialise phase.
   */
  public shouldInitialise(): boolean {
    return true;
  }

  /**
   * Initialise the view.
   */
  public async initialise(): Promise<void> {
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "boolean",
        message: this.state.question,
      },
    ]);

    this.state.value = answer.boolean;
    this.resetInitialise();
  }

  /**
   * Render the view.
   */
  public render(): number {
    terminal(`${this.state.question}: ${this.state.value ? "Yes" : "No"}\n`);
    return 1;
  }
}

export default UIQuestionViewBoolean;

/**
 * @overview UI Question View: Prompt for a number value.
 */

import { terminal } from "terminal-kit";
import inquirer from "inquirer";

import UIViewBase from "@/ui/views/base";

/**
 * Interface for the view's props.
 */
export interface IUIQuestionViewNumberProps {
  question: string;
}

/**
 * Interface for the view's default options.
 */
export interface IUIQuestionViewNumberOptions {}

/**
 * Interface for the view's internal state.
 */
interface IUIQuestionViewNumberState {
  question: string;
  value: number | null;
}

class UIQuestionViewNumber extends UIViewBase<IUIQuestionViewNumberState> {
  /**
   * Construct a new number question view.
   * @constructor
   * @param parent  Parent view to communicate with.
   * @param props   Properties for the view.
   * @param options Options for the view.
   */
  public constructor(
    parent: UIViewBase | null,
    props: IUIQuestionViewNumberProps,
    _options: Partial<IUIQuestionViewNumberOptions>,
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
  public getValue(): number | null {
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
        type: "number",
        name: "number",
        message: this.state.question,
      },
    ]);

    this.state.value = answer.number;
    this.resetInitialise();
  }

  /**
   * Render the view.
   */
  public render(): number {
    terminal(`${this.state.question}: ${this.state.value}\n`);
    return 1;
  }
}

export default UIQuestionViewNumber;

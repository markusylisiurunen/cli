/**
 * @overview UI Question View: Prompt for a string value.
 */

import { terminal } from "terminal-kit";
import inquirer from "inquirer";

import UIViewBase from "@/ui/views/base";

/**
 * Interface for the view's props.
 */
export interface IUIQuestionViewStringProps {
  question: string;
}

/**
 * Interface for the view's default options.
 */
export interface IUIQuestionViewStringOptions {}

/**
 * Interface for the view's internal state.
 */
interface IUIQuestionViewStringState {
  question: string;
  value: string | null;
}

class UIQuestionViewString extends UIViewBase<IUIQuestionViewStringState> {
  /**
   * Construct a new string question view.
   * @constructor
   * @param parent  Parent view to communicate with.
   * @param props   Properties for the view.
   * @param options Options for the view.
   */
  public constructor(
    parent: UIViewBase | null,
    props: IUIQuestionViewStringProps,
    _options: Partial<IUIQuestionViewStringOptions>,
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
  public getValue(): string | null {
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
        type: "input",
        name: "string",
        message: this.state.question,
      },
    ]);

    this.state.value = answer.string;
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

export default UIQuestionViewString;

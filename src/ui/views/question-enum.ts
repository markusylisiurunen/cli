/**
 * @overview UI Question View: Prompt for an enum value.
 */

import { terminal } from "terminal-kit";
import inquirer from "inquirer";

import UIViewBase from "@/ui/views/base";

/**
 * Interface for the view's props.
 */
export interface IUIQuestionViewEnumProps {
  question: string;
  choices: string[];
}

/**
 * Interface for the view's default options.
 */
export interface IUIQuestionViewEnumOptions {}

/**
 * Interface for the view's internal state.
 */
interface IUIQuestionViewEnumState {
  question: string;
  choices: string[];
  value: string | null;
}

class UIQuestionViewEnum extends UIViewBase<IUIQuestionViewEnumState> {
  /**
   * Construct a new enum question view.
   * @constructor
   * @param parent  Parent view to communicate with.
   * @param props   Properties for the view.
   * @param options Options for the view.
   */
  public constructor(
    parent: UIViewBase | null,
    props: IUIQuestionViewEnumProps,
    _options: Partial<IUIQuestionViewEnumOptions>,
  ) {
    super(parent);
    this.state = { question: props.question, choices: props.choices, value: null };
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
        type: "list",
        name: "enum",
        message: this.state.question,
        choices: this.state.choices,
        pageSize: 5,
      },
    ]);

    this.state.value = answer.enum;
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

export default UIQuestionViewEnum;

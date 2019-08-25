/**
 * @overview UI view controller.
 *
 * This is the main controller class that is exposed as a singleton object to the framework. It has
 * helper methods for creating different kinds of views.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { terminal } from "terminal-kit";

import UIViewBase from "@/ui/views/base";

import UIViewLog from "@/ui/views/log";
import UIViewTask, { IUIViewTaskProps, IUIViewTaskOptions } from "@/ui/views/task";

import UIQuestionViewBoolean, {
  IUIQuestionViewBooleanProps,
  IUIQuestionViewBooleanOptions,
} from "@/ui/views/question-boolean";
import UIQuestionViewEnum, {
  IUIQuestionViewEnumProps,
  IUIQuestionViewEnumOptions,
} from "@/ui/views/question-enum";
import UIQuestionViewNumber, {
  IUIQuestionViewNumberProps,
  IUIQuestionViewNumberOptions,
} from "@/ui/views/question-number";
import UIQuestionViewString, {
  IUIQuestionViewStringProps,
  IUIQuestionViewStringOptions,
} from "@/ui/views/question-string";

/**
 * Class for the root UI view.
 */
interface IUIViewRootState {}

class UIViewRoot extends UIViewBase<IUIViewRootState> {
  // Keep track of the child's rendered line count
  private childLineCount: number = 0;

  // Offset for where the child is located
  private childOffset: number = 0;

  private notify: (event: string, ...args: any) => void;

  /**
   * @constructor
   * @param notify Function to be invoked every time an event happens.
   */
  public constructor(notify: (event: string, ...args: any) => void) {
    super();
    this.notify = notify;
  }

  /**
   * Invoked by the child view to request a re-render.
   */
  protected requestReRender(): void {
    this.notify("rerender:before");

    this.reset();
    this.render();

    this.notify("rerender:after");
  }

  /**
   * Update the child offset.
   * @param offset The offset in lines.
   */
  public setChildOffset(offset: number): void {
    this.childOffset = offset;
  }

  /**
   * Reset the child view.
   */
  public reset(): void {
    if (this.childLineCount > 0) {
      terminal.column(0);

      if (this.childOffset > 0) {
        terminal.move(0, -1 * this.childOffset);
      }

      for (let i = 0; i < this.childLineCount; i += 1) {
        terminal.move(0, -1);
        terminal.eraseLine();
      }
    }
  }

  /**
   * Initialise the child view.
   */
  public async initialise(): Promise<void> {
    if (this.child !== null && this.child.shouldInitialise()) {
      await this.child.initialise();
    }
  }

  /**
   * Render the child view.
   */
  public render(): number {
    let lineCount = 0;

    if (this.child !== null) {
      lineCount = this.child.render();

      if (this.childOffset > 0) {
        terminal.move(0, this.childOffset);
      }
    }

    return (this.childLineCount = lineCount);
  }
}

/**
 * Singleton UI controller.
 */
class UIController {
  // Currently active view if any
  private views: UIViewRoot[] = [];

  /**
   * Create a new root view to catch the events from children.
   */
  private createRootView(): UIViewRoot {
    const viewIndex = this.views.length;

    return new UIViewRoot((event: string): void => {
      if (event === "rerender:before") {
        for (let i = this.views.length - 1; i > viewIndex; i -= 1) {
          this.views[i].reset();
        }
      }

      if (event === "rerender:after") {
        for (let i = viewIndex + 1; i < this.views.length; i += 1) {
          this.views[i].render();
        }
      }
    });
  }

  /**
   * Add a new view to the list of views.
   */
  private async createView<T>(createChildView: (rootView: UIViewRoot) => T): Promise<T> {
    const rootView = this.createRootView();
    const childView = createChildView(rootView);

    await rootView.initialise();
    rootView.render();

    this.views.push(rootView);

    return childView;
  }

  /**
   * Create a new boolean question view.
   * @param props     Props for the boolean question view.
   * @param [options] Options for the boolean question view.
   */
  public async askBoolean(
    props: string | IUIQuestionViewBooleanProps,
    options: Partial<IUIQuestionViewBooleanOptions> = {},
  ): Promise<UIQuestionViewBoolean> {
    return this.createView(
      (rootView): UIQuestionViewBoolean =>
        new UIQuestionViewBoolean(
          rootView,
          typeof props === "string" ? { question: props } : props,
          options,
        ),
    );
  }

  /**
   * Create a new enum question view.
   * @param props     Props for the enum question view.
   * @param [options] Options for the enum question view.
   */
  public async askEnum(
    props: IUIQuestionViewEnumProps,
    options: Partial<IUIQuestionViewEnumOptions> = {},
  ): Promise<UIQuestionViewEnum> {
    return this.createView(
      (rootView): UIQuestionViewEnum => new UIQuestionViewEnum(rootView, props, options),
    );
  }

  /**
   * Create a new number question view.
   * @param props     Props for the number question view.
   * @param [options] Options for the number question view.
   */
  public async askNumber(
    props: string | IUIQuestionViewNumberProps,
    options: Partial<IUIQuestionViewNumberOptions> = {},
  ): Promise<UIQuestionViewNumber> {
    return this.createView(
      (rootView): UIQuestionViewNumber =>
        new UIQuestionViewNumber(
          rootView,
          typeof props === "string" ? { question: props } : props,
          options,
        ),
    );
  }

  /**
   * Create a new string question view.
   * @param props     Props for the string question view.
   * @param [options] Options for the string question view.
   */
  public async askString(
    props: string | IUIQuestionViewStringProps,
    options: Partial<IUIQuestionViewStringOptions> = {},
  ): Promise<UIQuestionViewString> {
    return this.createView(
      (rootView): UIQuestionViewString =>
        new UIQuestionViewString(
          rootView,
          typeof props === "string" ? { question: props } : props,
          options,
        ),
    );
  }

  /**
   * Print a free-form log message to stdout.
   * @param text The text to print.
   */
  public log(text: any): UIViewLog {
    const rootView = this.createRootView();
    const logView = new UIViewLog(
      rootView,
      { text: typeof text === "string" ? text : String(text) },
      {},
    );

    rootView.render();
    this.views.push(rootView);

    return logView;
  }

  /**
   * Create a new task view.
   * @param props     Props for the task view.
   * @param [options] Options for the task view.
   */
  public task(
    props: IUIViewTaskProps | string,
    options: Partial<IUIViewTaskOptions> = {},
  ): UIViewTask {
    const rootView = this.createRootView();

    const taskViewProps = typeof props === "string" ? { text: props } : props;
    const taskView = new UIViewTask(rootView, taskViewProps, options);

    rootView.render();
    this.views.push(rootView);

    return taskView;
  }
}

export default new UIController();

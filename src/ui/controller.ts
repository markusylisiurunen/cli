/**
 * @overview UI view controller.
 *
 * This is the main controller class that is exposed as a singleton object to the framework. It has
 * helper methods for creating different kinds of views.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { terminal } from "terminal-kit";

import UIViewBase from "@/ui/views/base";

import UIViewLog, { IUIViewLogProps, IUIViewLogOptions } from "@/ui/views/log";
import UIViewTask, { IUIViewTaskProps, IUIViewTaskOptions } from "@/ui/views/task";

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
   * Print a free-form log message to stdout.
   * @param text The text to print.
   */
  public log(text: string): UIViewLog {
    const rootView = this.createRootView();
    const logView = new UIViewLog(rootView, { text }, {});

    rootView.render();
    this.views.push(rootView);

    return logView;
  }

  /**
   * Create a new task view.
   * @param props     Props for the task view.
   * @param [options] Options for the task view.
   */
  public task(props: IUIViewTaskProps, options: Partial<IUIViewTaskOptions> = {}): UIViewTask {
    const rootView = this.createRootView();
    const taskView = new UIViewTask(rootView, props, options);

    rootView.render();
    this.views.push(rootView);

    return taskView;
  }
}

export default new UIController();

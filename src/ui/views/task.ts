/**
 * @overview UI View: Task.
 */

import chalk from "chalk";
import { terminal } from "terminal-kit";

import UIViewBase from "@/ui/views/base";

import colors from "@/ui/colors";
import icons from "@/ui/icons";

type TUIViewTaskStatus = "running" | "completed" | "failed";

/**
 * Interface for the view's props.
 */
export interface IUIViewTaskProps {
  text: string;
}

/**
 * Interface for the view's default options.
 */
export interface IUIViewTaskOptions {
  status: TUIViewTaskStatus;
}

/**
 * Interface for the view's internal state.
 */
interface IUIViewTaskState {
  text: string;
  status: TUIViewTaskStatus;
  runningIndicatorSequenceIndex: number;
}

class UIViewTask extends UIViewBase<IUIViewTaskState> {
  // The animated indicator if status is "running"
  private runningIndicatorSequence = ["\u2013", "\\", "|", "/"];
  private runningIndicatorInterval: NodeJS.Timeout | null = null;

  /**
   * Construct a new task view.
   * @constructor
   * @param parent  Parent view to communicate with.
   * @param props   Properties for the view.
   * @param options Options for the view.
   */
  public constructor(
    parent: UIViewBase | null,
    props: IUIViewTaskProps,
    options: Partial<IUIViewTaskOptions>,
  ) {
    super(parent);

    const defaultOptions: IUIViewTaskOptions = {
      status: "running",
    };

    const populatedOptions: IUIViewTaskOptions = {
      ...defaultOptions,
      ...options,
    };

    this.state = {
      text: props.text,
      status: populatedOptions.status,
      runningIndicatorSequenceIndex: 0,
    };

    if (this.state.status === "running") {
      this.startRunningIndicatorAnimation();
    }
  }

  /**
   * Start the indicator loop.
   */
  private startRunningIndicatorAnimation(): void {
    this.runningIndicatorInterval = setInterval((): void => {
      const sequence = this.runningIndicatorSequence;
      const index = this.state.runningIndicatorSequenceIndex;

      this.setState({
        runningIndicatorSequenceIndex: index === sequence.length - 1 ? 0 : index + 1,
      });
    }, 150);
  }

  /**
   * Stop the indicator loop.
   */
  private stopRunningIndicatorAnimation(): void {
    if (this.runningIndicatorInterval) {
      clearInterval(this.runningIndicatorInterval);
      this.runningIndicatorInterval = null;
    }
  }

  /**
   * Update the status of the view.
   * @param status New status for the view.
   */
  public setStatus(status: TUIViewTaskStatus): void {
    if (this.state.status === status) return;

    if (status === "running") {
      this.setState({ status: "running" });
      this.startRunningIndicatorAnimation();
    } else {
      this.setState({ status, runningIndicatorSequenceIndex: 0 });
      this.stopRunningIndicatorAnimation();
    }
  }

  /**
   * Render the view.
   */
  public render(): number {
    const runningIcon = this.runningIndicatorSequence[this.state.runningIndicatorSequenceIndex];
    const config = {
      running: [colors.warning, runningIcon],
      completed: [colors.success, icons.plusSign],
      failed: [colors.error, icons.exclamationMark],
    }[this.state.status];

    terminal(chalk`{${config[0]} ${config[1]}} ${this.state.text}\n`);

    return 1;
  }
}

export default UIViewTask;

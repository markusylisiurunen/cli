/**
 * @overview UI View: Task.
 */

import chalk from "chalk";
import { terminal } from "terminal-kit";

import UIView from "../views/base";

import colors from "../colors";
import icons from "../icons";

type TUIViewTaskStatus = "running" | "completed" | "failed";

export interface IUIViewTaskProps {
  text: string;
  status: TUIViewTaskStatus;
}

export interface IUIViewTaskState {
  text: string;
  status: TUIViewTaskStatus;
  runningIndicatorSequenceIndex: number;
}

class UIViewTask extends UIView<IUIViewTaskState> {
  // The animated indicator if status is "running"
  private runningIndicatorSequence = ["\u2013", "\\", "|", "/"];
  private runningIndicatorInterval: NodeJS.Timeout | null = null;

  public constructor(parent: UIView | null, { text, status }: IUIViewTaskProps) {
    super(parent);

    this.state = { text, status, runningIndicatorSequenceIndex: 0 };

    if (status === "running") {
      this.startRunningIndicatorAnimation();
    }
  }

  private startRunningIndicatorAnimation(): void {
    this.runningIndicatorInterval = setInterval((): void => {
      const sequence = this.runningIndicatorSequence;
      const index = this.state.runningIndicatorSequenceIndex;

      this.setState({
        runningIndicatorSequenceIndex: index === sequence.length - 1 ? 0 : index + 1,
      });
    }, 150);
  }

  private stopRunningIndicatorAnimation(): void {
    if (this.runningIndicatorInterval) {
      clearInterval(this.runningIndicatorInterval);
      this.runningIndicatorInterval = null;
    }
  }

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

  public reset(): void {
    terminal.eraseLine();
    terminal.column(0);
  }

  public render(): void {
    const runningIcon = this.runningIndicatorSequence[this.state.runningIndicatorSequenceIndex];
    const config = {
      running: [colors.warning, runningIcon],
      completed: [colors.success, icons.plusSign],
      failed: [colors.error, icons.exclamationMark],
    }[this.state.status];

    terminal(chalk`{${config[0]} ${config[1]}} ${this.state.text}`);
  }
}

export default UIViewTask;

/**
 * @overview Tests for the task view.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { terminal } from "terminal-kit";

import UIViewTask from "@/ui/views/task";

import colors from "@/ui/colors";
import icons from "@/ui/icons";

// Mock terminal-kit
jest.mock("terminal-kit", (): any => ({
  terminal: jest.fn(),
}));

// Mock chalk
jest.mock("chalk", (): any =>
  jest
    .fn()
    .mockImplementation((strings: string[], ...values: any): string =>
      strings.reduce(
        (acc, str, index): string => `${acc}${str}${index < values.length ? values[index] : ""}`,
        "",
      ),
    ),
);

describe("ui/views/task", (): void => {
  afterEach((): void => {
    (terminal as any).mockClear();
  });

  it("prints the task message with a proper icon", (): void => {
    const view = new UIViewTask(null, { text: "Hello" }, {});
    let lines = view.render();

    expect(terminal).toHaveBeenCalledTimes(1);
    expect(terminal).toHaveBeenLastCalledWith(`{${colors.warning} \u2013} Hello\n`);

    expect(lines).toBe(1);

    view.setStatus("completed");

    lines = view.render();

    expect(terminal).toHaveBeenCalledTimes(2);
    expect(terminal).toHaveBeenLastCalledWith(`{${colors.success} ${icons.plusSign}} Hello\n`);

    expect(lines).toBe(1);

    view.setStatus("failed");

    lines = view.render();

    expect(terminal).toHaveBeenCalledTimes(3);
    expect(terminal).toHaveBeenLastCalledWith(`{${colors.error} ${icons.exclamationMark}} Hello\n`);

    expect(lines).toBe(1);
  });

  it("accepts the status as an option", (): void => {
    const view = new UIViewTask(null, { text: "Hello" }, { status: "completed" });
    let lines = view.render();

    expect(terminal).toHaveBeenCalledTimes(1);
    expect(terminal).toHaveBeenLastCalledWith(`{${colors.success} ${icons.plusSign}} Hello\n`);

    expect(lines).toBe(1);
  });
});

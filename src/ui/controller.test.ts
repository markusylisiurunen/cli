/**
 * @overview Tests for the ui controller.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { terminal } from "terminal-kit";

import controller from "@/ui/controller";

import colors from "@/ui/colors";
import icons from "@/ui/icons";

// Mock terminal-kit
jest.mock("terminal-kit", (): any => {
  const terminalMock = jest.fn();

  (terminalMock as any).column = jest.fn();
  (terminalMock as any).move = jest.fn();
  (terminalMock as any).eraseLine = jest.fn();

  return { terminal: terminalMock };
});

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

describe("ui/controller", (): void => {
  afterEach((): void => {
    (terminal as any).mockClear();
  });

  it("creates a new log view", (): void => {
    controller.log("Hello");

    expect(terminal).toHaveBeenCalledTimes(1);
    expect(terminal).toHaveBeenLastCalledWith("Hello\n");
  });

  it("creates a new task view", (): void => {
    controller.log("Hello");
    controller.task("Hello");

    expect(terminal).toHaveBeenCalledTimes(2);

    expect(terminal).toHaveBeenNthCalledWith(1, "Hello\n");
    expect(terminal).toHaveBeenNthCalledWith(2, `{${colors.warning} \u2013} Hello\n`);
  });

  it("updates a view", (): void => {
    const task = controller.task("Hello");
    controller.log("Hello");
    task.setStatus("completed");

    expect(terminal).toHaveBeenCalledTimes(4);

    expect(terminal).toHaveBeenNthCalledWith(1, `{${colors.warning} \u2013} Hello\n`);
    expect(terminal).toHaveBeenNthCalledWith(2, "Hello\n");
    expect(terminal).toHaveBeenNthCalledWith(3, `{${colors.success} ${icons.plusSign}} Hello\n`);
    expect(terminal).toHaveBeenNthCalledWith(4, "Hello\n");
  });
});

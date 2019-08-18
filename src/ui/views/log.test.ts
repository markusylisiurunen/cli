/**
 * @overview Tests for the log view.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { terminal } from "terminal-kit";

import UIViewLog from "@/ui/views/log";

// Mock terminal-kit
jest.mock("terminal-kit", (): any => ({
  terminal: jest.fn(),
}));

describe("ui/views/log", (): void => {
  afterEach((): void => {
    (terminal as any).mockClear();
  });

  it("prints a single line", (): void => {
    const view = new UIViewLog(null, { text: "Hello" }, {});
    const lines = view.render();

    expect(terminal).toHaveBeenCalledTimes(1);
    expect(terminal).toHaveBeenLastCalledWith("Hello\n");

    expect(lines).toBe(1);
  });

  it("prints multiple lines", (): void => {
    const view = new UIViewLog(null, { text: "Hello\nWorld" }, {});
    const lines = view.render();

    expect(terminal).toHaveBeenCalledTimes(1);
    expect(terminal).toHaveBeenLastCalledWith("Hello\nWorld\n");

    expect(lines).toBe(2);
  });
});

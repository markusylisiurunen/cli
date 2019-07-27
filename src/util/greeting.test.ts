/**
 * @overview Tests for the greeting utility module.
 */

import greeting from "@/util/greeting";

describe("util/greeting", () => {
  it("says hello", () => {
    expect(greeting.generateSimpleGreeting("Name")).toBe("Hello, Name!");
  });
});

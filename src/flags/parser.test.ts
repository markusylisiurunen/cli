/**
 * @overview Tests for the flags parser.
 */

import parse from "@/flags/parser";

import FlagTypeString from "@/flags/types/string";

describe("flags/parser", (): void => {
  it("parses a basic valid flag map", (): void => {
    const flagMap = { helloWorld: "Hello, World!" };
    const flagDefinitions = [new FlagTypeString("helloWorld", "h", "Hello world", {})];

    const parsed = parse(flagMap, flagDefinitions);

    expect(parsed.helloWorld).toBe("Hello, World!");
  });

  it("parses a more complicated flag map", (): void => {
    const flagMap = { h: "Hello, World!" };
    const flagDefinitions = [
      new FlagTypeString("helloWorld", "h", "Hello world", {}),
      new FlagTypeString("otherFlag", "o", "Other flag", { optional: true }),
    ];

    const parsed = parse(flagMap, flagDefinitions);

    expect(parsed.helloWorld).toBe("Hello, World!");
    expect(parsed.otherFlag).toBe(undefined);
  });
});

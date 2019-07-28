/**
 * @overview Tests for the flags parser.
 */

import parse from "@/flags/parser";

import FlagTypeString from "@/flags/types/string";
import FlagTypeEnum from "@/flags/types/enum";

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

  it("parses a flag map with enums", (): void => {
    const flagMap = { greeting: "hello", name: "Name" };
    const flagDefinitions = [
      new FlagTypeEnum("greeting", "g", "Greeting.", { choices: ["hello", "hi"] }),
      new FlagTypeString("name", "n", "Name.", {}),
    ];

    const parsed = parse(flagMap, flagDefinitions);

    expect(parsed.greeting).toBe("hello");
    expect(parsed.name).toBe("Name");
  });

  it("throws if an enum is invalid", (): void => {
    const flagMap = { greeting: "Yo", name: "Name" };
    const flagDefinitions = [
      new FlagTypeEnum("greeting", "g", "Greeting.", { choices: ["hello", "hi"] }),
      new FlagTypeString("name", "n", "Name.", {}),
    ];

    expect((): void => {
      parse(flagMap, flagDefinitions);
    }).toThrow();
  });
});

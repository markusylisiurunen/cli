/**
 * @overview Tests for the flags parser.
 */

import parse from "@/flags/parser";

import FlagTypeBoolean from "@/flags/types/boolean";
import FlagTypeEnum from "@/flags/types/enum";
import FlagTypeNumber from "@/flags/types/number";
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

  it("parses a flag map with all available types", (): void => {
    const flagMap = { greeting: "hello", name: "Name", hasShirt: "1", age: "34" };
    const flagDefinitions = [
      new FlagTypeEnum("greeting", "g", "Greeting.", { choices: ["hello", "hi"] }),
      new FlagTypeString("name", "n", "Name.", {}),
      new FlagTypeBoolean("hasShirt", "h", "Shirt.", {}),
      new FlagTypeNumber("age", "a", "Age.", {}),
    ];

    const parsed = parse(flagMap, flagDefinitions);

    expect(parsed.greeting).toBe("hello");
    expect(parsed.name).toBe("Name");
    expect(parsed.hasShirt).toBe(true);
    expect(parsed.age).toBe(34);
  });

  it("throws if a flag has an invalid value", (): void => {
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

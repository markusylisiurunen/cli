/**
 * @overview Tests for the enum flag type.
 */

import FlagTypeEnum from "@/flags/types/enum";

describe("flags/types/enum", (): void => {
  it("returns undefined if optional", (): void => {
    const flag = new FlagTypeEnum("test", "t", "Test flag", {
      optional: true,
      choices: ["1", "2"],
    });

    const value = flag.parse(undefined);

    expect(value).toBeUndefined();
  });

  it("throws if is not optional and flag was not passed", (): void => {
    const flag = new FlagTypeEnum("test", "t", "Test flag", {
      optional: false,
      choices: ["1", "2"],
    });

    expect((): string | undefined => flag.parse(undefined)).toThrow();
  });

  it("parses a valid option properly", (): void => {
    const flag = new FlagTypeEnum("test", "t", "Test flag", {
      optional: true,
      choices: ["1", "2"],
    });

    expect(flag.parse("1")).toBe("1");
    expect(flag.parse("2")).toBe("2");
  });

  it("parses an invalid option properly", (): void => {
    const flag = new FlagTypeEnum("test", "t", "Test flag", {
      optional: true,
      choices: ["1", "2"],
    });

    expect((): string | undefined => flag.parse("3")).toThrow();
  });
});

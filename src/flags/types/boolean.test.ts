/**
 * @overview Tests for the boolean flag type.
 */

import FlagTypeBoolean from "@/flags/types/boolean";

describe("flags/types/boolean", (): void => {
  it("returns undefined if optional", (): void => {
    const flag = new FlagTypeBoolean("test", "t", "Test flag", { optional: true });
    const value = flag.parse(undefined);

    expect(value).toBeUndefined();
  });

  it("throws if is not optional and flag was not passed", (): void => {
    const flag = new FlagTypeBoolean("test", "t", "Test flag", { optional: false });
    expect((): boolean | undefined => flag.parse(undefined)).toThrow();
  });

  it("parses truthy values correctly", (): void => {
    const flag = new FlagTypeBoolean("test", "t", "Test flag", { optional: false });

    expect(flag.parse("1")).toBe(true);
    expect(flag.parse("true")).toBe(true);
  });

  it("parses falsy values correctly", (): void => {
    const flag = new FlagTypeBoolean("test", "t", "Test flag", { optional: false });

    expect(flag.parse("0")).toBe(false);
    expect(flag.parse("false")).toBe(false);
  });

  it("throws if invalid value", (): void => {
    const flag = new FlagTypeBoolean("test", "t", "Test flag", { optional: false });
    expect((): boolean | undefined => flag.parse("hello")).toThrow();
  });
});

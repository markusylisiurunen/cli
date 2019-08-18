/**
 * @overview Tests for the string flag type.
 */

import FlagTypeString from "@/flags/types/string";

describe("flags/types/string", (): void => {
  it("returns undefined if optional", (): void => {
    const flag = new FlagTypeString("test", "t", "Test flag", { optional: true });
    const value = flag.parse(undefined);

    expect(value).toBeUndefined();
  });

  it("throws if is not optional and flag was not passed", (): void => {
    const flag = new FlagTypeString("test", "t", "Test flag", { optional: false });
    expect((): string | undefined => flag.parse(undefined)).toThrow();
  });

  it("parses a string properly", (): void => {
    const flag = new FlagTypeString("test", "t", "Test flag", { optional: false });
    const value = flag.parse("hello");

    expect(value).toBe("hello");
  });

  it("trims whitespace correctly", (): void => {
    const flag = new FlagTypeString("test", "t", "Test flag", { optional: false });
    const value = flag.parse("hello  ");

    expect(value).toBe("hello");
  });
});

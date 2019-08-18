/**
 * @overview Tests for the number flag type.
 */

import FlagTypeNumber from "@/flags/types/number";

describe("flags/types/number", (): void => {
  it("returns undefined if optional", (): void => {
    const flag = new FlagTypeNumber("test", "t", "Test flag", { optional: true });
    const value = flag.parse(undefined);

    expect(value).toBeUndefined();
  });

  it("throws if is not optional and flag was not passed", (): void => {
    const flag = new FlagTypeNumber("test", "t", "Test flag", { optional: false });
    expect((): number | undefined => flag.parse(undefined)).toThrow();
  });

  it("parses positive integer values properly", (): void => {
    const flag = new FlagTypeNumber("test", "t", "Test flag", { optional: false });
    const value = flag.parse("1");

    expect(value).toBe(1);
  });

  it("parses negative integer values properly", (): void => {
    const flag = new FlagTypeNumber("test", "t", "Test flag", { optional: false });
    const value = flag.parse("-1");

    expect(value).toBe(-1);
  });

  it("parses positive float values properly", (): void => {
    const flag = new FlagTypeNumber("test", "t", "Test flag", { optional: false });
    const value = flag.parse("1.25");

    expect(value).toBeCloseTo(1.25);
  });

  it("parses negative float values properly", (): void => {
    const flag = new FlagTypeNumber("test", "t", "Test flag", { optional: false });
    const value = flag.parse("-1.25");

    expect(value).toBeCloseTo(-1.25);
  });
});

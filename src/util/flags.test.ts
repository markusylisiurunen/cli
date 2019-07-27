/**
 * @overview Test: Utility flags module.
 */

import flags from "./flags";

describe("util/flags", () => {
  describe("string", () => {
    it("parses a valid value", () => {
      const config = flags.types.string(["hello", "h"], "Hello world.");
      const value = config.parser("hello", config.options);

      expect(value).toBe("hello");
    });

    it("throws with a missing value", () => {
      const config = flags.types.string(["hello", "h"], "Hello world.");

      expect(() => config.parser(undefined, config.options)).toThrow();
    });
  });

  describe("stringEnum", () => {
    it("parses a valid value", () => {
      const config = flags.types.stringEnum(["hello", "h"], "Hello world.", { choices: ["world"] });
      const value = config.parser("world", config.options);

      expect(value).toBe("world");
    });

    it("throws with a missing value", () => {
      const config = flags.types.stringEnum(["hello", "h"], "Hello world.", { choices: ["world"] });

      expect(() => config.parser(undefined, config.options)).toThrow();
    });

    it("throws with an invalid value", () => {
      const config = flags.types.stringEnum(["hello", "h"], "Hello world.", { choices: ["world"] });

      expect(() => config.parser("hello", config.options)).toThrow();
    });
  });
});

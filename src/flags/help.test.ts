/**
 * @overview Tests for the help module.
 */

import help from "@/flags/help";

import FlagTypeBoolean from "@/flags/types/boolean";
import FlagTypeEnum from "@/flags/types/enum";
import FlagTypeNumber from "@/flags/types/number";
import FlagTypeString from "@/flags/types/string";

describe("flags/help", (): void => {
  it("produces a correct help block with only long names", (): void => {
    const result = help([
      new FlagTypeBoolean("flag-one", null, "Description for flag one.", {}),
      new FlagTypeEnum("flag-two", null, "Description for flag two.", { choices: ["1"] }),
      new FlagTypeNumber("flag-three", null, "Description for flag three.", {}),
      new FlagTypeString("flag-four", null, "Description for flag four.", {}),
    ]);

    expect(result).toBe(
      [
        "--flag-four <string>   Description for flag four.",
        "--flag-one <boolean>   Description for flag one.",
        "--flag-three <number>  Description for flag three.",
        "--flag-two <string>    Description for flag two.",
      ].join("\n"),
    );
  });

  it("produces a correct help block with both full and short names", (): void => {
    const result = help([
      new FlagTypeBoolean("flag-one", "o", "Description for flag one.", {}),
      new FlagTypeEnum("flag-two", "t", "Description for flag two.", { choices: ["1"] }),
      new FlagTypeNumber("flag-three", null, "Description for flag three.", {}),
      new FlagTypeString("flag-four", null, "Description for flag four.", {}),
    ]);

    expect(result).toBe(
      [
        "    --flag-four <string>   Description for flag four.",
        "-o, --flag-one <boolean>   Description for flag one.",
        "    --flag-three <number>  Description for flag three.",
        "-t, --flag-two <string>    Description for flag two.",
      ].join("\n"),
    );
  });

  it("produces a correct help block with optional flags", (): void => {
    const result = help([
      new FlagTypeBoolean("flag-one", "o", "Description for flag one.", {}),
      new FlagTypeEnum("flag-two", "t", "Description for flag two.", { choices: ["1"] }),
      new FlagTypeNumber("flag-three", null, "Description for flag three.", {}),
      new FlagTypeString("flag-four", null, "Description for flag four.", { optional: true }),
    ]);

    expect(result).toBe(
      [
        "-o, --flag-one <boolean>   Description for flag one.",
        "    --flag-three <number>  Description for flag three.",
        "-t, --flag-two <string>    Description for flag two.",
        "    --flag-four [string]   Description for flag four.",
      ].join("\n"),
    );
  });
});

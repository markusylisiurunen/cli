/**
 * @overview Flags parser.
 */

import FlagTypeBoolean from "@/flags/types/boolean";
import FlagTypeEnum from "@/flags/types/enum";
import FlagTypeNumber from "@/flags/types/number";
import FlagTypeString from "@/flags/types/string";

type ParsedFlagType = string | boolean | number | undefined;

/**
 * Parse captured raw string flag values into the final casted values.
 * @param flagMap         An object of the parsed flags by minimist.
 * @param flagDefinitions The definitions for the available flags.
 */
export default function parse(
  flagMap: { [key: string]: string },
  flagDefinitions: (FlagTypeString | FlagTypeEnum | FlagTypeNumber | FlagTypeBoolean)[],
): { [key: string]: ParsedFlagType } {
  const parsedFlagValues: { [key: string]: ParsedFlagType } = {};

  for (const flag of flagDefinitions) {
    let value: string | undefined = undefined;

    if (flagMap[flag.longName] !== undefined) {
      value = flagMap[flag.longName];
    } else if (flag.shortName !== null && flagMap[flag.shortName] !== undefined) {
      value = flagMap[flag.shortName];
    }

    const parsedValue = flag.parse(value);
    parsedFlagValues[flag.longName] = parsedValue;
  }

  return parsedFlagValues;
}

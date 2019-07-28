/**
 * @overview Flags parser.
 */

import FlagTypeString from "@/flags/types/string";

type ParsedFlagType = string | undefined;

/**
 * Parse captured raw string flag values into the final casted values.
 * @param flagMap         An object of the parsed flags by minimist.
 * @param flagDefinitions The definitions for the available flags.
 */
export default function parse(
  flagMap: { [key: string]: string },
  flagDefinitions: FlagTypeString[],
): { [key: string]: ParsedFlagType } {
  const parsedFlagValues: { [key: string]: ParsedFlagType } = {};

  for (const flag of flagDefinitions) {
    let value: string | undefined = undefined;

    if (flagMap[flag.longName]) {
      value = flagMap[flag.longName];
    } else if (flag.shortName !== null && flagMap[flag.shortName]) {
      value = flagMap[flag.shortName];
    }

    try {
      const parsedValue = flag.parse(value);
      parsedFlagValues[flag.longName] = parsedValue;
    } catch (error) {
      throw new Error();
    }
  }

  return parsedFlagValues;
}

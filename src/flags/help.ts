/**
 * @overview Produce the flag help message.
 */

import FlagTypeBoolean from "@/flags/types/boolean";
import FlagTypeEnum from "@/flags/types/enum";
import FlagTypeNumber from "@/flags/types/number";
import FlagTypeString from "@/flags/types/string";

export default function help(
  flagDefinitions: (FlagTypeBoolean | FlagTypeEnum | FlagTypeNumber | FlagTypeString)[],
): string {
  const options: string[][] = [];

  const sortedFlagDefinitions = flagDefinitions.sort((a, b): number => {
    if (a.getOptions().optional === true && b.getOptions().optional === false) return 1;
    if (a.getOptions().optional === false && b.getOptions().optional === true) return -1;
    if (a.longName < b.longName) return -1;
    if (b.longName < a.longName) return 1;
    return 0;
  });

  const hasSomeShortName = flagDefinitions.some((flag): boolean => flag.shortName !== null);

  for (const flagDefinition of sortedFlagDefinitions) {
    const option = [];

    if (!hasSomeShortName) {
      option.push(`--${flagDefinition.longName}`);
    } else if (flagDefinition.shortName === null) {
      option.push(`    --${flagDefinition.longName}`);
    } else {
      option.push(`-${flagDefinition.shortName}, --${flagDefinition.longName}`);
    }

    option[0] +=
      flagDefinition.getOptions().optional === true
        ? ` [${flagDefinition.argumentType}]`
        : ` <${flagDefinition.argumentType}>`;

    option.push(flagDefinition.description);

    options.push(option);
  }

  const longestName = options.reduce(
    (prev, current): string => (current[0].length > prev.length ? current[0] : prev),
    "",
  );

  return options
    .map(
      (option): string =>
        `${option[0]}  ${option[1].padStart(
          longestName.length - option[0].length + option[1].length,
          " ",
        )}`,
    )
    .join("\n");
}

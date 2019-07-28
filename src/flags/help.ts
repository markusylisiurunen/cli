/**
 * @overview Module for printing command messages.
 */

import FlagTypeString from "@/flags/types/string";

export default function printHelp(
  commandName: string,
  commandDescription: string,
  flagDefinitions: FlagTypeString[],
): void {
  const lines = [];

  // Usage information
  lines.push(`Usage: ${commandName} [OPTIONS]`);
  lines.push("");

  // Command description
  lines.push(commandDescription);
  lines.push("");

  // Options
  lines.push("Options:");

  const options: string[][] = [];

  const sortedFlagDefinitions = flagDefinitions.sort((a, b): number => {
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

    option[0] += ` <${flagDefinition.argumentType}>`;

    option.push(flagDefinition.description);

    options.push(option);
  }

  const longestName = options.reduce(
    (prev, current): string => (current[0].length > prev.length ? current[0] : prev),
    "",
  );

  lines.push(
    ...options.map(
      (option): string =>
        `${option[0]}  ${option[1].padStart(
          longestName.length - option[0].length + option[1].length,
          " ",
        )}`,
    ),
  );

  // eslint-disable-next-line no-console
  console.log(["", ...lines, ""].join("\n"));
}

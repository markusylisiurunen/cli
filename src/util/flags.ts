/**
 * @overview Utility: Command line flags.
 */

// TYPES
// =====

/**
 * Interface for a datastructure representing a flag configuration.
 */
export interface IFlagConfiguration<ReturnType, OptionsType> {
  nameLong: string;
  nameShort: string | null;
  description: string;
  parser: (raw: string | undefined, options?: OptionsType) => ReturnType;
  options?: OptionsType;
}

// FLAG TYPE: STRING
// =================

export interface IFlagStringOptions {}

function parseString(raw: string | undefined, _options?: IFlagStringOptions): string {
  if (raw === undefined) {
    throw new Error("Invalid type.");
  }

  return raw;
}

// FLAG TYPE: STRING ENUM
// ======================

export interface IFlagStringEnumOptions {
  choices: string[];
}

function parseStringEnum(raw: string | undefined, options?: IFlagStringEnumOptions): string {
  if (raw === undefined) {
    throw new Error("Invalid type.");
  } else if (!options) {
    throw new Error("Invalid options.");
  }

  if (!options.choices.includes(raw)) {
    throw new Error("Invalid type.");
  }

  return raw;
}

// CONFIGURATION CREATOR
// =====================

/**
 * Create a new flag configuration.
 */
function createConfiguration<ReturnType, OptionsType>(
  parser: (raw: string | undefined, options?: OptionsType) => ReturnType,
): (
  [long, short]: [string, string?],
  description: string,
  options?: OptionsType,
) => IFlagConfiguration<ReturnType, OptionsType> {
  return ([long, short], description, options) => ({
    nameLong: long,
    nameShort: short || null,
    description,
    parser,
    options,
  });
}

export default {
  types: {
    string: createConfiguration<string, IFlagStringOptions>(parseString),
    stringEnum: createConfiguration<string, IFlagStringEnumOptions>(parseStringEnum),
  },
};

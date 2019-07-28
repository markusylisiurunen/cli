/**
 * @overview Flag type: Enum.
 */

import FlagTypeBase, { IFlagTypeBaseOptions } from "@/flags/types/base";

/**
 * Interface for the enum flag type options.
 */
export interface IFlagTypeEnumOptions extends IFlagTypeBaseOptions {
  choices: string[];
}

export default class FlagTypeEnum extends FlagTypeBase<string, IFlagTypeEnumOptions> {
  public argumentType = "string";

  /**
   * Parse the raw flag value.
   * @param rawFlagValue The string value of the provided flag if any.
   */
  public parse(rawFlagValue: string | undefined): string | undefined {
    if (this.options.optional !== true && rawFlagValue === undefined) {
      throw this.errorUndefined();
    }

    if (rawFlagValue === undefined) {
      return undefined;
    }

    if (!this.options.choices.includes(rawFlagValue.trim())) {
      throw this.errorInvalid();
    }

    return rawFlagValue.trim();
  }
}

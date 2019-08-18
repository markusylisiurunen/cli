/**
 * @overview Flag type: Boolean.
 */

import FlagTypeBase, { IFlagTypeBaseOptions } from "@/flags/types/base";

/**
 * Interface for the boolean flag type options.
 */
export interface IFlagTypeBooleanOptions extends IFlagTypeBaseOptions {}

export default class FlagTypeBoolean extends FlagTypeBase<boolean, IFlagTypeBooleanOptions> {
  public argumentType = "boolean";

  /**
   * Parse the raw flag value.
   * @param rawFlagValue The string value of the provided flag if any.
   */
  public parse(rawFlagValue: string | undefined): boolean | undefined {
    if (this.options.optional !== true && rawFlagValue === undefined) {
      throw this.errorUndefined();
    }

    if (rawFlagValue === undefined) {
      return undefined;
    }

    const validValues = ["1", "0", "true", "false"];

    if (!validValues.includes(rawFlagValue.trim())) {
      throw this.errorInvalid();
    }

    return rawFlagValue.trim() === "1" || rawFlagValue.trim() === "true";
  }
}

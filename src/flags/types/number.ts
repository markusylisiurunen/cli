/**
 * @overview Flag type: Number.
 */

import FlagTypeBase, { IFlagTypeBaseOptions } from "@/flags/types/base";

/**
 * Interface for the number flag type options.
 */
export interface IFlagTypeNumberOptions extends IFlagTypeBaseOptions {}

export default class FlagTypeNumber extends FlagTypeBase<number, IFlagTypeNumberOptions> {
  public argumentType = "number";

  /**
   * Parse the raw flag value.
   * @param rawFlagValue The string value of the provided flag if any.
   */
  public parse(rawFlagValue: string | undefined): number | undefined {
    if (this.options.optional !== true && rawFlagValue === undefined) {
      throw this.errorUndefined();
    }

    if (typeof rawFlagValue === "string") {
      const parsed = parseFloat(rawFlagValue.trim());

      if (Number.isNaN(parsed)) {
        throw this.errorInvalid();
      }

      return parsed;
    }

    return undefined;
  }
}

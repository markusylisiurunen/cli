/**
 * @overview Flag type: String.
 */

import FlagTypeBase, { IFlagTypeBaseOptions } from "@/flags/types/base";

/**
 * Interface for the string flag type options.
 */
export interface IFlagTypeStringOptions extends IFlagTypeBaseOptions {}

export default class FlagTypeString extends FlagTypeBase<string, IFlagTypeStringOptions> {
  public argumentType = "string";

  /**
   * Parse the raw flag value.
   * @param rawFlagValue The string value of the provided flag if any.
   */
  public parse(rawFlagValue: string | undefined): string | undefined {
    if (this.options.optional !== true && rawFlagValue === undefined) {
      throw this.errorUndefined();
    }

    return typeof rawFlagValue === "string" ? rawFlagValue.trim() : undefined;
  }
}

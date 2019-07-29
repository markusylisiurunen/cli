/**
 * @overview Types for the flags.
 */

import FlagTypeString from "@/flags/types/string";
import FlagTypeEnum from "@/flags/types/enum";

/**
 * Type for a flag definition.
 */
export type TFlagDefinition = FlagTypeString | FlagTypeEnum;

/**
 * Interface for parsed flags.
 */
export interface IFlagsParsed {
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

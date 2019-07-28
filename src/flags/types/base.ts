/**
 * @overview Flag type: Base. Every other type extends this.
 */

/**
 * Interface for the common flag type options.
 */
export interface IFlagTypeBaseOptions {
  optional?: boolean;
}

export default abstract class FlagTypeBase<ReturnType, Options extends IFlagTypeBaseOptions> {
  // Public information about the flag
  public longName: string;
  public shortName: string | null;
  public description: string;

  // The name of the type of argument
  public abstract argumentType: string;

  // Store the options for the flag
  protected options: Options;

  /**
   * Constructor for the flag type.
   * @constructor
   * @param longName    Long name for the flag.
   * @param shortName   Short name for the flag.
   * @param description Description for the flag.
   * @param options     Additional flag type specific options.
   */
  public constructor(
    longName: string,
    shortName: string | null,
    description: string,
    options: Options,
  ) {
    this.longName = longName;
    this.shortName = shortName;
    this.description = description;

    this.options = options;
  }

  /**
   * Error for undefined value.
   */
  protected errorUndefined(): Error {
    return new Error(`Flag (--${this.longName}) cannot be undefined.`);
  }

  /**
   * Parse the raw flag value.
   * @param rawFlagValue The string value of the provided flag if any.
   */
  abstract parse(rawFlagValue: string | undefined): ReturnType | undefined;
}

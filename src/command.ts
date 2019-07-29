/**
 * @overview The Command class to be extended.
 */

import { TFlagDefinition, IFlagsParsed } from "@/types/flags";

import printFlagsHelp from "@/flags/help";

export default abstract class Command {
  // Name of this command
  public abstract name: string;

  // Short command description
  public abstract description: string;

  // Flag definitions
  public abstract flagDefinitions: TFlagDefinition[] = [];

  /**
   * Interactively populate the flag values based on the flagDefinitions attribute.
   */
  protected async populateFlags(flagDefinitions: TFlagDefinition[]): Promise<IFlagsParsed> {
    const flags: IFlagsParsed = {};

    for (const flagDefinition of flagDefinitions) {
      // eslint-disable-next-line no-console
      console.log(`Populating flag --${flagDefinition.longName}.`);
    }

    return flags;
  }

  /**
   * Print help for this command.
   */
  public printHelp(): void {
    printFlagsHelp(this.name, this.description, this.flagDefinitions);
  }

  /**
   * This method will be called for a command whenever the CLI application is run in an interactive
   * mode.
   */
  public abstract async runInteractive(): Promise<void>;

  /**
   * This method will be called for a command whenever the CLI application is run with flags already
   * provided.
   */
  public abstract async runStatic(flags: IFlagsParsed): Promise<void>;
}

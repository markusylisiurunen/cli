/**
 * @overview The Command base class.
 */

import FlagTypeBoolean, { IFlagTypeBooleanOptions } from "@/flags/types/boolean";
import FlagTypeEnum, { IFlagTypeEnumOptions } from "@/flags/types/enum";
import FlagTypeNumber, { IFlagTypeNumberOptions } from "@/flags/types/number";
import FlagTypeString, { IFlagTypeStringOptions } from "@/flags/types/string";

import createFlagsHelpBlock from "@/flags/help";

import uiController from "@/ui/controller";

type FlagDefinition = FlagTypeBoolean | FlagTypeEnum | FlagTypeNumber | FlagTypeString;

function createFlag<O>(
  factory: (
    longName: string,
    shortName: string | null,
    description: string,
    options: O,
  ) => FlagDefinition,
): (longName: string, shortName: string | null, description: string, options: O) => FlagDefinition {
  return (
    longName: string,
    shortName: string | null,
    description: string,
    options: O,
  ): FlagDefinition => {
    return factory(longName, shortName, description, options);
  };
}

export default abstract class Command {
  // Name of this command
  public abstract name: string;

  // Short command description
  public abstract description: string;

  // Flag definitions
  public abstract flagDefinitions: FlagDefinition[] = [];

  // EXTERNAL MODULES
  // ================

  // prettier-ignore
  protected flags = {
    boolean: createFlag<IFlagTypeBooleanOptions>((...args): FlagTypeBoolean => new FlagTypeBoolean(...args)),
    enum: createFlag<IFlagTypeEnumOptions>((...args): FlagTypeEnum => new FlagTypeEnum(...args)),
    number: createFlag<IFlagTypeNumberOptions>((...args): FlagTypeNumber => new FlagTypeNumber(...args)),
    string: createFlag<IFlagTypeStringOptions>((...args): FlagTypeString => new FlagTypeString(...args)),
  };

  protected ui = {
    askBoolean: uiController.askBoolean.bind(uiController),
    askEnum: uiController.askEnum.bind(uiController),
    askNumber: uiController.askNumber.bind(uiController),
    askString: uiController.askString.bind(uiController),
    log: uiController.log.bind(uiController),
    task: uiController.task.bind(uiController),
  };

  // PROTECTED API
  // =============

  protected async populateFlags(): Promise<{ [key: string]: unknown }> {
    const result: { [key: string]: unknown } = {};

    this.ui.log("\nYou entered interactive mode. Please answer the following questions.\n");

    const flagDefinitions = [...this.flagDefinitions];

    while (flagDefinitions.length > 0) {
      const [flag] = flagDefinitions.slice(0, 1);

      // FlagTypeBoolean
      if (flag instanceof FlagTypeBoolean) {
        const question = await this.ui.askBoolean(
          `(--${flag.longName}) ${flag.description} <${flag.argumentType}>`,
        );

        const rawValue = question.getValue();

        try {
          const parsedValue = flag.parse(rawValue !== null ? rawValue.toString() : undefined);
          result[flag.longName] = parsedValue;
        } catch (error) {
          this.ui.log("Invalid value. Please try again.");
          continue;
        }
      }

      // FlagTypeEnum
      if (flag instanceof FlagTypeEnum) {
        const question = await this.ui.askEnum({
          question: `(--${flag.longName}) ${flag.description} <${flag.argumentType}>`,
          choices: (flag as FlagTypeEnum).getOptions().choices,
        });

        const rawValue = question.getValue();

        try {
          const parsedValue = flag.parse(rawValue !== null ? rawValue : undefined);
          result[flag.longName] = parsedValue;
        } catch (error) {
          this.ui.log("Invalid value. Please try again.");
          continue;
        }
      }

      // FlagTypeNumber
      if (flag instanceof FlagTypeNumber) {
        const question = await this.ui.askString(
          `(--${flag.longName}) ${flag.description} <${flag.argumentType}>`,
        );

        const rawValue = question.getValue();

        try {
          const parsedValue = flag.parse(rawValue !== null ? rawValue : undefined);
          result[flag.longName] = parsedValue;
        } catch (error) {
          this.ui.log("Invalid value. Please try again.");
          continue;
        }
      }

      // FlagTypeString
      if (flag instanceof FlagTypeString) {
        const question = await this.ui.askString(
          `(--${flag.longName}) ${flag.description} <${flag.argumentType}>`,
        );

        let rawValue: string | null | undefined = question.getValue();
        rawValue = rawValue === "" ? undefined : rawValue;

        try {
          const parsedValue = flag.parse(rawValue !== null ? rawValue : undefined);
          result[flag.longName] = parsedValue;
        } catch (error) {
          this.ui.log("Invalid value. Please try again.");
          continue;
        }
      }

      flagDefinitions.shift();
    }

    this.ui.log(
      "\nFlags populated. If you want to run the command with the same configuration again, you can do it with the following flags.\n",
    );

    this.ui.log(
      `${Object.entries(result).reduce(
        (acc, [name, value]): string => `${acc} --${name} '${(value as any).toString()}'`,
        "",
      )}\n`,
    );

    return result;
  }

  // PUBLIC API
  // ==========

  /**
   * Print help for this command and exit.
   */
  public help(): void {
    process.stdout.write("\n");
    process.stdout.write(`Usage: ${this.name} [OPTIONS]`);
    process.stdout.write("\n\n");
    process.stdout.write(`${this.description}`);
    process.stdout.write("\n\n");

    process.stdout.write("Options:");
    process.stdout.write("\n");

    process.stdout.write(
      createFlagsHelpBlock(this.flagDefinitions)
        .split("\n")
        .map((line): string => `  ${line}`)
        .join("\n"),
    );

    process.stdout.write("\n");

    process.exit(0);
  }

  /**
   * This method will be called for a command whenever the CLI application is run in an interactive
   * mode.
   */
  public abstract async runInteractive(): Promise<void>;

  /**
   * This method will be called for a command whenever the CLI application is run with flags already
   * provided.
   * @param flags A map of the parsed flags based on the flag definitions.
   */
  public abstract async runStatic(flags: { [key: string]: unknown }): Promise<void>;
}

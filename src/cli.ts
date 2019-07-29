/**
 * @overview The main framework "runtime".
 */

import minimist from "minimist";

import Command from "@/command";

import parseFlags from "@/flags/parser";

/**
 * The main CLI runtime class.
 * @class
 */
class Cli {
  private commands: { [key: string]: Command } = {};

  /**
   * Print command help view.
   */
  private printCommandsHelp(): void {
    const lines: string[] = [];

    if (Object.keys(this.commands).length === 0) {
      lines.push("No commands available.");
    } else {
      lines.push("Run 'COMMAND --help' for more detailed help.");
      lines.push("");

      lines.push("Commands:");

      // Create a commands list
      let commandLines = [];

      for (const [name, command] of Object.entries(this.commands)) {
        commandLines.push([name, command.description]);
      }

      // Pad each description properly
      const longestCommandName = commandLines.reduce(
        (prev, [name]): string => (prev.length < name.length ? name : prev),
        "",
      );

      for (const commandLine of commandLines) {
        lines.push(
          `  ${commandLine[0]}  ${commandLine[1].padStart(
            longestCommandName.length - commandLine[0].length + commandLine[1].length,
            " ",
          )}`,
        );
      }
    }

    // Print the final output
    // eslint-disable-next-line no-console
    console.log(["", ...lines, ""].join("\n"));
  }

  /**
   * Print options help view for a command.
   * @param name Name of the command.
   */
  private printOptionsHelp(name: string): void {
    if (this.commands[name] === undefined) {
      throw new Error(`Tried to print options help view for an unknown command '${name}'.`);
    }

    this.commands[name].printHelp();
  }

  /**
   * Register a new command.
   * @param name    Name of the command to register.
   * @param command An instance of Command class.
   */
  public registerCommand(name: string, command: Command): void {
    if (this.commands[name] !== undefined) {
      throw new Error(`Tried to register command '${name}' twice.`);
    }

    this.commands[name] = command;
  }

  /**
   * Entrypoint for the framework runtime.
   */
  public async run(): Promise<void> {
    const availableFlags = Object.entries(this.commands)
      .map(([_name, command]): string[] => {
        return command.flagDefinitions
          .map((def): string[] => (def.shortName ? [def.longName, def.shortName] : [def.longName]))
          .flat();
      })
      .flat();

    const flags = minimist(process.argv.slice(2), { string: availableFlags });

    // Print command help if needed
    if (flags._.length === 0 || this.commands[flags._[0]] === undefined) {
      this.printCommandsHelp();
      return;
    }

    const commandName = flags._[0];

    // Print command options help if requested
    if (flags.help) {
      this.printOptionsHelp(commandName);
      return;
    }

    // Pass control to command if requested in interactive mode
    if (flags.interactive) {
      await this.commands[commandName].runInteractive();
      return;
    }

    // Try to parse required flags
    const parsedFlags = parseFlags(flags, this.commands[commandName].flagDefinitions);

    await this.commands[commandName].runStatic(parsedFlags);
  }
}

/**
 * Get a singleton CLI.
 */
const getCli: () => Cli = ((): (() => Cli) => {
  let cli: Cli | null = null;

  return (): Cli => {
    if (cli === null) {
      cli = new Cli();
    }

    return cli;
  };
})();

export default {
  /**
   * Register a new command.
   * @param command Instance of Command class.
   */
  register(command: Command): void {
    getCli().registerCommand(command.name, command);
  },

  /**
   * Start the runtime.
   */
  run(): Promise<void> {
    return getCli().run();
  },
};

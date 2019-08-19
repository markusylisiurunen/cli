/**
 * @overview The main framework "runtime".
 */

import minimist from "minimist";

import Command from "@/command";

import parseFlags from "@/flags/parser";

class Cli {
  // A set of registered commands
  private commands: { [key: string]: Command } = {};

  // INTERNAL METHODS
  // ================

  /**
   * Print help for all commands.
   */
  private helpCommands(): void {
    if (Object.keys(this.commands).length === 0) {
      process.stdout.write("\n");
      process.stdout.write("No commands available.");
      process.stdout.write("\n");

      process.exit(0);
    }

    process.stdout.write("\n");
    process.stdout.write("Run 'COMMAND --help' for more detailed help.");
    process.stdout.write("\n\n");

    process.stdout.write("Commands:");
    process.stdout.write("\n");

    const sortedCommandNames = Object.keys(this.commands).sort();
    const commands = [];

    for (const commandName of sortedCommandNames) {
      commands.push([commandName, this.commands[commandName].description]);
    }

    const commandNameLongest = commands.reduce(
      (prev, [name]): string => (prev.length < name.length ? name : prev),
      "",
    );

    for (const command of commands) {
      process.stdout.write(
        `  ${command[0]}  ${command[1].padStart(
          commandNameLongest.length - command[0].length + command[1].length,
          " ",
        )}`,
      );

      process.stdout.write("\n");
    }

    process.exit(0);
  }

  /**
   * Print help for a single command.
   * @param name Name of the command.
   */
  private helpCommand(name: string): void {
    if (this.commands[name] === undefined) {
      throw new Error(`Tried to print help for an unknown command '${name}'.`);
    }

    this.commands[name].help();
  }

  // PUBLIC API
  // ==========

  /**
   * Register a new command.
   * @param name    Name of the command to register.
   * @param command An instance of Command class.
   */
  public register(name: string, command: Command): void {
    if (this.commands[name] !== undefined) {
      throw new Error(`Tried to register command '${name}' twice.`);
    }

    this.commands[name] = command;
  }

  /**
   * Entrypoint method for the CLI to start running a command.
   */
  public async run(): Promise<void> {
    // Parse the flags to strings with minimist

    const flagsToParseAsString = Object.entries(this.commands)
      .map(([_name, command]): string[] => {
        return command.flagDefinitions
          .map((definition): string[] =>
            definition.shortName
              ? [definition.longName, definition.shortName]
              : [definition.longName],
          )
          .flat();
      })
      .flat();

    const flags = minimist(process.argv.slice(2), { string: flagsToParseAsString });

    // Print command list help message

    if (flags._.length === 0 || !this.commands[flags._[0]]) {
      this.helpCommands();
    }

    // Print command's help message

    const [command] = flags._;

    if (flags.help === true || flags.h === true) {
      this.helpCommand(command);
    }

    // Pass control to the command instance

    if (flags.interactive === true || flags.i === true) {
      return await this.commands[command].runInteractive();
    }

    const parsedFlags = parseFlags(flags, this.commands[command].flagDefinitions);

    return await this.commands[command].runStatic(parsedFlags);
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
    getCli().register(command.name, command);
  },

  /**
   * Start the runtime.
   */
  run(): Promise<void> {
    return getCli().run();
  },
};

/**
 * @overview A CLI application for deploying a monorepo application to Kubernetes.
 *
 * Usage: node deploy.js --service frontend --environment dev
 */

/* eslint-disable */

const cli: any = null;

class DeployCommand extends cli.Command {
  /**
   * One of the most important aspect of any CLI are the flags it accepts. These let the user
   * configure what needs to be done and with what values. Below is an example of a configuration
   * for the flags.
   */

  // prettier-ignore
  public static flagsConfig = [
    cli.flag.enum("service", "s", "Service to deploy.", { choices: ["frontend", "backend"] }),
    cli.flag.enum("environment", "e", "Environment to deploy to.", { choices: ["dev", "staging", "prod"] }),
    cli.flag.string("token", "t", "Authentication token for Kubernetes.", { optional: true }),
  ];

  /**
   * Any command can be run either interactively or statically. Interactive means that the flag
   * values will be asked at the runtime and static requires them to be set beforehand. There are
   * two versions of the run function. runInteractive() will be called in interactive mode and
   * runStatic() in static mode.
   *
   * It is possible to let the framework handle populating flag values. Below is an example of this.
   */
  public async runInteractive() {
    const flags = await this.populateFlags();
    await this.main(flags);
  }

  /**
   * Any command can also be run statically which requires the flags to be set beforehand. Below is
   * an example of doing just that.
   */
  public async runStatic(flags) {
    // You can ask for additional information here if needed.

    await this.main(flags);
  }

  private async main(flags) {
    // Do whatever you wish with the flags.
    console.log(flags);
  }
}

cli.register("", DeployCommand);

cli.run(process.argv);

/**
 * @overview A CLI application for deploying a monorepo application to Kubernetes.
 */

const cli: any = null;

class Deploy extends cli.Command {
  // prettier-ignore
  public static flagsConfig = [
    cli.flag.stringEnum(["service", "s"], "Service to deploy.", { choices: ["frontend", "backend"] }),
    cli.flag.stringEnum(["environment", "e"], "Environment to deploy to.", { choices: ["dev", "staging", "prod"] }),
    cli.flag.string(["token", "t"], "Authentication token for Kubernetes", { optional: true }),
  ];

  public async run() {
    // TODO: Implement the mock logic...
  }
}

cli.register("", Deploy);

cli.run(process.argv);

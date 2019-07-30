/**
 * @overview A CLI application for deploying a monorepo application to Kubernetes.
 *
 * Usage: node deploy.js --service frontend --environment dev
 */

/* eslint-disable */

import cli from "../../src";

class DeployCommand extends cli.Command {
  /**
   * One of the most important aspect of any CLI are the flags it accepts. These let the user
   * configure what needs to be done and with what values. Below is an example of a configuration
   * for the flags.
   */

  public name = "deploy";

  public description = "Deploy a service to a Kubernetes cluster.";

  // prettier-ignore
  public flagDefinitions = [
    cli.flags.enum("service", "s", "Service to deploy.", { choices: ["frontend", "backend"] }),
    cli.flags.enum("environment", "e", "Environment to deploy to.", { choices: ["dev", "staging", "prod"] }),
    cli.flags.string("token", "t", "Authentication token for Kubernetes.", { optional: true }),
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
  public async runStatic() {
    // You can ask for additional information here if needed.
    await this.main(flags);
  }

  private async main(flags) {
    // Indicator for a single task
    const uiTask1 = ui.task(
      { text: "Build a Docker container for front-end service." },
      { status: "running" },
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      uiTask1.updateState({ status: "failed" }).commit();
      return;
    }

    uiTask1.updateState({ status: "completed" }).commit();

    // Run multiple tasks in parallel
    const uiTask2 = ui.task({ text: "Deploy to staging environment." }, { status: "running" });
    const uiTask3 = ui.task({ text: "Deploy to production environment." }, { status: "running" });

    const uiTaskList = ui.list([uiTask2, uiTask3]);

    try {
      const task2 = new Promise((resolve) => setTimeout(resolve, 3500));
      const task3 = new Promise((resolve) => setTimeout(resolve, 5000));

      uiTask2.listenForPromise(task2);
      uiTask3.listenForPromise(task3);

      await Promise.all([task2, task3]);
    } catch (error) {
      uiTaskList.commit();
      return;
    }

    uiTaskList.commit();
  }
}

cli.registerCommand(new DeployCommand());

cli.run();

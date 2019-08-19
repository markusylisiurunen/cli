import cli from "@/cli";
import Command from "@/command";

class HelloCommand extends Command {
  public name = "hello";
  public description = "Say hello to your friend.";

  public flagDefinitions = [
    this.flags.string("flag-one", "o", "Description for flag one.", { optional: true }),
    this.flags.enum("flag-two", "t", "Description for flag two.", {
      choices: ["1"],
      optional: true,
    }),
    this.flags.number("flag-three", null, "Description for flag three.", { optional: true }),
    this.flags.boolean("flag-four", null, "Description for flag four.", { optional: true }),
  ];

  public async runInteractive(): Promise<void> {}

  public async runStatic(flags: { [key: string]: any }): Promise<void> {
    const task = this.ui.task("Hello world");

    this.ui.log("Hello from static.");
    this.ui.log(JSON.stringify(flags));

    task.setStatus("completed");
  }
}

cli.register(new HelloCommand());
cli.run();

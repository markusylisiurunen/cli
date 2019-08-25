import cli from "@/index";

class CalculatorCommand extends cli.Command {
  public name = "calculate";
  public description = "A simple command line calculator.";

  public flagDefinitions = [
    this.flags.enum("operator", "o", "Operator for the calculation.", {
      choices: ["+", "-", "*", "/"],
    }),
    this.flags.number("a", null, "The first operand.", {}),
    this.flags.number("b", null, "The second operand.", {}),
  ];

  private async main(flags: { operator: string; a: number; b: number }): Promise<void> {
    const task = this.ui.task("Calculating...");

    await new Promise((r): NodeJS.Timeout => setTimeout(r, 2000));

    task.setStatus("completed");

    let result: number | null = null;

    switch (flags.operator) {
      case "+":
        result = flags.a + flags.b;
        break;
      case "-":
        result = flags.a - flags.b;
        break;
      case "*":
        result = flags.a * flags.b;
        break;
      case "/":
        result = flags.a / flags.b;
        break;
    }

    this.ui.log(`Answer: ${result}`);
  }

  public async runInteractive(): Promise<void> {
    this.main((await this.populateFlags()) as any);
  }

  public async runStatic(flags: { [key: string]: any }): Promise<void> {
    this.main(flags as any);
  }
}

cli.register(new CalculatorCommand());

cli.run();

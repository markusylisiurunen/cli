import ui from "@/ui/index";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve): void => {
    setTimeout(resolve, ms);
  });
}

async function main(): Promise<void> {
  const taskOne = ui.controller.task("Deploying 'front-end' to Zeit Now.");
  const taskTwo = ui.controller.task("Building Docker container for 'back-end'.");

  await sleep(2000);
  ui.controller.log("[ERROR]: Zeit API at api.zeit.com responded with 404.");
  ui.controller.log(new Error("Some random error with stack trace.").stack);

  taskOne.setStatus("failed");

  await sleep(2500);
  taskTwo.setStatus("completed");

  const taskThree = ui.controller.task("Deploying 'back-end' to Kubernetes.");

  await sleep(5000);
  taskThree.setStatus("completed");
}

main();

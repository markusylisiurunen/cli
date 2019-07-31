import ui from "../src/ui/index";

async function main(): Promise<void> {
  const uiViewTaskOne = new ui.views.UIViewTask(null, {
    text: "Deploy service 'frontend' to Kubernetes.",
    status: "running",
  });

  // FIXME: UI controller should do all of this
  uiViewTaskOne.render();

  await new Promise((resolve, _reject): NodeJS.Timeout => setTimeout(resolve, 2000));
  uiViewTaskOne.setStatus("completed");

  // FIXME: The view should somehow be able to "commit"
  process.stdout.write("\n");

  const uiViewTaskTwo = new ui.views.UIViewTask(null, {
    text: "Deploy service 'backend' to Kubernetes.",
    status: "running",
  });

  // FIXME: UI controller should do all of this
  uiViewTaskTwo.render();

  try {
    await new Promise((_resolve, reject): NodeJS.Timeout => setTimeout(reject, 2000));
  } catch (error) {
    uiViewTaskTwo.setStatus("failed");
    return;
  }

  uiViewTaskTwo.setStatus("completed");
}

main();

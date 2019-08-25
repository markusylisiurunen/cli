import ui from "@/ui/index";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const questionName = await ui.controller.askString("Full name");
  const questionAge = await ui.controller.askNumber("Age");
  const questionFavoriteColor = await ui.controller.askEnum({
    question: "Favorite color",
    choices: ["black", "white", "blue", "red", "green", "yellow", "pink"],
  });
  const questionIsRich = await ui.controller.askBoolean("Own over 100k€");

  const taskProcessing = ui.controller.task("Processing...");
  await sleep(2500);
  taskProcessing.setStatus("completed");

  ui.controller.log(
    JSON.stringify({
      name: questionName.getValue(),
      age: questionAge.getValue(),
      favoriteColor: questionFavoriteColor.getValue(),
      isRich: questionIsRich.getValue(),
    }),
  );
}

main();

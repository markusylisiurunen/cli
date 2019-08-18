/**
 * @overview UI.
 */

import UIController from "@/ui/controller";

import UIViewLog from "@/ui/views/log";
import UIViewTask from "@/ui/views/task";

import colors from "./colors";
import icons from "./icons";

export default {
  colors,
  icons,
  controller: UIController,
  views: {
    UIViewLog,
    UIViewTask,
  },
};

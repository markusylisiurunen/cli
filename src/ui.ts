/**
 * @overview Module for helping with UI component.
 */

import { ColorName, ColorValue, IconName, IconValue } from "@/types/ui";

import chalk from "chalk";

// AVAILABLE COLORS & ICONS
// ========================

const colors: { [key in ColorName]: ColorValue } = {
  success: "rgb(44,191,78)",
  warning: "rgb(252,127,3)",
  error: "rgb(252,3,3)",
};

const icons: { [key in IconName]: IconValue } = {
  exclamationMark: "\u0021",
  plusSign: "\u203B",
  questionMark: "\u003F",
};

export default {
  colors,
  icons,

  /**
   * Create a styled text.
   * @param strings Tagged template literal raw strings.
   * @param rest    Tagged template literal rest parameters.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text(strings: TemplateStringsArray, ...rest: any): string {
    return chalk(strings, ...rest);
  },
};

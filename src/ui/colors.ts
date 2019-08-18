/**
 * @overview UI colors.
 */

export type ColorName = "plain" | "success" | "warning" | "error";
export type ColorValue = string;

const colors: { [key in ColorName]: ColorValue } = {
  plain: "rgb(255,255,255)",
  success: "rgb(44,191,78)",
  warning: "rgb(252,127,3)",
  error: "rgb(252,3,3)",
};

export default colors;

/**
 * @overview UI colors.
 */

export type ColorName = "success" | "warning" | "error";
export type ColorValue = string;

const colors: { [key in ColorName]: ColorValue } = {
  success: "rgb(44,191,78)",
  warning: "rgb(252,127,3)",
  error: "rgb(252,3,3)",
};

export default colors;

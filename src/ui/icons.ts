/**
 * @overview UI icons.
 */

export type IconName = "questionMark" | "plusSign" | "exclamationMark";
export type IconValue = string;

const icons: { [key in IconName]: IconValue } = {
  exclamationMark: "\u0021",
  plusSign: "\u203B",
  questionMark: "\u003F",
};

export default icons;

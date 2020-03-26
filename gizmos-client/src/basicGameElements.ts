//R - Red, B - Black, U - Blue, Y - Yellow
export const initialDispenser = Array(52)
  .fill("R", 0, 14)
  .fill("B", 13, 27)
  .fill("U", 26, 40)
  .fill("Y", 39, 52);

export enum EnergyType {
  Red = "R",
  Black = "B",
  Blue = "U",
  Yellow = "Y"
}

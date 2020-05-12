export enum EnergyType {
  Any = "RUBY",
  Red = "R",
  Blue = "U",
  Black = "B",
  Yellow = "Y",
}

function* repeat<T>(x: T, n: number): Generator<T> {
  while (n-- > 0) yield x;
}

export const initialDispenser: ReadonlyArray<EnergyType> = [
  ...repeat(EnergyType.Red, 13),
  ...repeat(EnergyType.Blue, 13),
  ...repeat(EnergyType.Black, 13),
  ...repeat(EnergyType.Yellow, 13),
];

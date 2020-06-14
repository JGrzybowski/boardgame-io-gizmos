export enum EnergyType {
  Any = "RUBY",
  Red = "R",
  Blue = "U",
  Black = "B",
  Yellow = "Y",
}

export function isEnergyType(x: unknown): x is EnergyType {
  const asEnum = x as EnergyType;
  return (
    asEnum === EnergyType.Red ||
    asEnum === EnergyType.Blue ||
    asEnum === EnergyType.Black ||
    asEnum === EnergyType.Yellow ||
    asEnum === EnergyType.Any
  );
}

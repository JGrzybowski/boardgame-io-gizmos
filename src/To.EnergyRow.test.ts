import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { To } from "./To";
import { GameS } from "./gameState";
import { EnergyType } from "./basicGameElements";

test("throws an error if trying to add Any energy", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act && Assert
  expect(() => To.EnergyRow()(G, EnergyType.Any)).toThrowError();
});

test("Adds provided energy at the end of energy row", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act
  const afterPut = To.EnergyRow()(G, EnergyType.Red);

  // Assert
  expect(afterPut.energyRow[0]).toBe(EnergyType.Blue);
  expect(afterPut.energyRow[1]).toBe(EnergyType.Black);
  expect(afterPut.energyRow[2]).toBe(EnergyType.Red);
});

test("Does not modify original game state", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  const originalGameState = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act
  const afterPut = To.EnergyRow()(G, EnergyType.Red);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { To } from "./To";
import { GameS } from "../gameState";

test("throws an error if trying to add Any energy", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act && Assert
  expect(() => To.Dispenser()(G, new EnergyTypeDictionary(1, 2, 3, 4, 2))).toThrowError();
});

test("Adds provided energy to dispenser's totals", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act
  const afterPut = To.Dispenser()(G, new EnergyTypeDictionary(1, 2, 3, 4, 0));

  // Assert
  expect(afterPut.dispenser.R).toBe(6);
  expect(afterPut.dispenser.U).toBe(7);
  expect(afterPut.dispenser.B).toBe(8);
  expect(afterPut.dispenser.Y).toBe(9);
  expect(afterPut.dispenser.Any).toBe(0);
});

test("throws error if provided zero energy", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act && Assert
  expect(() => To.Dispenser()(G, new EnergyTypeDictionary(0, 0, 0, 0, 0))).toThrowError();
});

test("Does not modify original game state", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  const originalGameState = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act
  const afterPut = To.Dispenser()(G, new EnergyTypeDictionary(1, 2, 3, 4, 0));

  // Assert
  expect(G).toMatchObject(originalGameState);
});

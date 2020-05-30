import { GameS } from "./gameState";
import { PlayerState } from "./playerState";
import { From } from "./From";
import { EnergyType } from "./basicGameElements";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";

test("Removes energy with specified index from the dispenser", () => {
  // Arrange
  const G = new GameS({
    dispenser: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });

  // Act
  const [afterPick, pickedEnergy] = From.Dispenser(2)(G);

  // Assert
  expect(afterPick.dispenser).toHaveLength(4);
  expect(afterPick.dispenser[0]).toBe(EnergyType.Red);
  expect(afterPick.dispenser[1]).toBe(EnergyType.Blue);
  expect(afterPick.dispenser[2]).toBe(EnergyType.Black);
  expect(afterPick.dispenser[3]).toBe(EnergyType.Yellow);
});

test("Returns EnergyTypeDictionary with energyType placed on specified index", () => {
  // Arrange
  const G = new GameS({
    dispenser: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });

  // Act
  const [afterPick, pickedEnergy] = From.Dispenser(2)(G);

  // Assert
  expect(pickedEnergy).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Yellow, 1));
});

test("Throws an Error if asked for energy from outside of dispenser range", () => {
  // Arrange
  const G = new GameS({
    dispenser: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });

  // Act & Assert
  expect(() => From.Dispenser(5)(G)).toThrowError();
  expect(() => From.Dispenser(-1)(G)).toThrowError();
});

test("Does not modify the original game state", () => {
  // Arrange
  const G = new GameS({
    dispenser: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const originalGameState = new GameS({
    dispenser: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  // Act
  From.Dispenser(3)(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

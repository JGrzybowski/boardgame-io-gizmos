import { GameS } from "./gameState";
import { PlayerState } from "./playerState";
import { From } from "./From";
import { EnergyType } from "./basicGameElements";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";

function pickNth(n: number) {
  return () => n;
}

test("Decreases the amount of energy with index specified by the selection function", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });

  // Act
  const [afterPick, pickedEnergy] = From.Dispenser(pickNth(13))(G);

  // Assert
  expect(afterPick.dispenser.R).toBe(5);
  expect(afterPick.dispenser.U).toBe(5);
  expect(afterPick.dispenser.B).toBe(4);
  expect(afterPick.dispenser.Y).toBe(5);
  expect(afterPick.dispenser.Any).toBe(0);
});

test("Returns EnergyTypeDictionary with energyType placed on specified index", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });

  // Act
  const [afterPick, pickedEnergy] = From.Dispenser(pickNth(13))(G);

  // Assert
  expect(pickedEnergy).toBe(EnergyType.Black);
});

test("Throws an Error if asked for energy from outside of EnergyRow range", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });

  // Act & Assert
  expect(() => From.Dispenser(pickNth(-13))(G)).toThrowError();
  expect(() => From.Dispenser(pickNth(150))(G)).toThrowError();
});

test("Does not modify the original game state", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const originalGameState = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  // Act
  From.Dispenser(pickNth(13))(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

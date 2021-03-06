import { GameS } from "../gameState";
import { PlayerState } from "../playerState";
import { From } from "./From";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";

test("Removes energy with specified index from the energyRow", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });
  const picker = From.EnergyRow(2);

  // Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  // Assert
  expect(afterPick.energyRow).toHaveLength(4);
  expect(afterPick.energyRow[0]).toBe(EnergyType.Red);
  expect(afterPick.energyRow[1]).toBe(EnergyType.Blue);
  expect(afterPick.energyRow[2]).toBe(EnergyType.Black);
  expect(afterPick.energyRow[3]).toBe(EnergyType.Yellow);
});

test("Returns EnergyTypeDictionary with energyType placed on specified index", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });
  const picker = From.EnergyRow(2);

  // Act
  expect(picker.canPick(G)).toBeTruthy();
  const [, pickedEnergy] = picker.pick(G);

  // Assert
  expect(pickedEnergy).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Yellow, 1));
});

test("Throws an Error if asked for energy from outside of EnergyRow range", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });
  const picker = From.EnergyRow(5);

  // Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
});

test("Throws an Error if asked for energy with negative range", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });
  const picker = From.EnergyRow(-5);

  // Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
});

test("CanPick does not modify the original game state", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const originalGameState = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const picker = From.EnergyRow(3);

  // Act
  picker.canPick(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

test("Pick does not modify the original game state", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const originalGameState = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const picker = From.EnergyRow(3);

  // Act
  picker.pick(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

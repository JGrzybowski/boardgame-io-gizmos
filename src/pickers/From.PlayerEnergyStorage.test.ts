import { GameS } from "../gameState";
import { PlayerState } from "../playerState";
import { From } from "./From";
import { EnergyType } from "../basicGameElements";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";

test("Removes one of specified energy from the player's energy storage", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });
  const picker = From.PlayerEnergyStorage("0", EnergyType.Red);

  // Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  // Assert
  expect(afterPick.players["0"].energyStorage.R).toBe(1);
  expect(afterPick.players["0"].energyStorage.U).toBe(3);
  expect(afterPick.players["0"].energyStorage.B).toBe(4);
  expect(afterPick.players["0"].energyStorage.Y).toBe(5);
  expect(afterPick.players["0"].energyStorage.Any).toBe(0);
});

test("Returns EnergyTypeDictionary with specified energyType", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });
  const picker = From.PlayerEnergyStorage("0", EnergyType.Red);

  // Act
  expect(picker.canPick(G)).toBeTruthy();
  const [, pickedEnergy] = picker.pick(G);

  // Assert
  expect(pickedEnergy).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Red, 1));
});

test("Throws an Error if asked for Any Energy", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 1) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 1) }),
    },
  });
  const picker = From.PlayerEnergyStorage("0", EnergyType.Any);

  // Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
});

test("Throws an Error if player does not have specified energy in the storage", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(0, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });
  const picker = From.PlayerEnergyStorage("0", EnergyType.Red);

  // Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
});

test("CanPick does not modify the original game state", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  // Act
  const picker = From.PlayerEnergyStorage("0", EnergyType.Red);

  // Act
  picker.canPick(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

test("Pick does not modify the original game state", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  // Act
  const picker = From.PlayerEnergyStorage("0", EnergyType.Red);

  // Act
  picker.pick(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

test("Pick does not modify the the other player state", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });
  const picker = From.PlayerEnergyStorage("0", EnergyType.Red);

  // Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  // Assert
  expect(afterPick.players["1"]).toMatchObject(G.players["1"]);
});

test("Throws an Error if there is no player with given Id", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });
  const picker = From.PlayerEnergyStorage("100", EnergyType.Red);

  // Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
});

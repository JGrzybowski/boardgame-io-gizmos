import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { To } from "./To";
import { GameS } from "../gameState";
import { PlayerState } from "../playerState";

test("Adds provided energy to player energy storage", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const putter = To.PlayerEnergyStorage("0");
  const energyToAdd = new EnergyTypeDictionary(1, 2, 3, 4, 0);

  // Act
  expect(putter.canPut(G, energyToAdd)).toBeTruthy();
  const afterPut = putter.put(G, energyToAdd);

  // Assert
  expect(afterPut.players["0"].energyStorage.R).toBe(3);
  expect(afterPut.players["0"].energyStorage.U).toBe(5);
  expect(afterPut.players["0"].energyStorage.B).toBe(7);
  expect(afterPut.players["0"].energyStorage.Y).toBe(9);
  expect(afterPut.players["0"].energyStorage.Any).toBe(0);
});

test("throws an error if trying to add Any energy", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const putter = To.PlayerEnergyStorage("0");
  const energyToAdd = new EnergyTypeDictionary(1, 2, 3, 4, 2);

  // Act && Assert
  expect(putter.canPut(G, energyToAdd)).toBeFalsy();
  expect(() => putter.put(G, energyToAdd)).toThrowError();
});

test("throws error if provided zero energy", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const putter = To.PlayerEnergyStorage("0");
  const energyToAdd = new EnergyTypeDictionary(0, 0, 0, 0, 0);

  // Act && Assert
  expect(putter.canPut(G, energyToAdd)).toBeFalsy();
  expect(() => putter.put(G, energyToAdd)).toThrowError();
});

test("throws error if player with provided id does not exist", () => {
  // Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", energyStorage: new EnergyTypeDictionary(2, 3, 4, 5, 0) }),
      "1": new PlayerState({ playerId: "1", energyStorage: new EnergyTypeDictionary(1, 2, 3, 4, 0) }),
    },
  });

  const putter = To.PlayerEnergyStorage("100");
  const energyToAdd = new EnergyTypeDictionary(1, 2, 3, 4, 0);

  // Act && Assert
  expect(putter.canPut(G, energyToAdd)).toBeFalsy();
  expect(() => putter.put(G, energyToAdd)).toThrowError();
});

test("CanPut does not modify original game state", () => {
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

  const putter = To.PlayerEnergyStorage("0");
  const energyToAdd = new EnergyTypeDictionary(1, 2, 3, 4, 0);

  // Act
  putter.canPut(G, energyToAdd);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

test("Put does not modify original game state", () => {
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

  const putter = To.PlayerEnergyStorage("0");
  const energyToAdd = new EnergyTypeDictionary(1, 2, 3, 4, 0);

  // Act
  putter.put(G, energyToAdd);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

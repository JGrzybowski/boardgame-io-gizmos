import { GameS } from "../gameState";
import { PlayerState } from "../playerState";
import { From } from "./From";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";

function pickNth(n: number) {
  return (): number => n;
}

test("Decreases the amount of energy with index specified by the selection function", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
  });
  const picker = From.Dispenser(pickNth(13));

  // Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

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
  const picker = From.Dispenser(pickNth(13));

  // Act
  expect(picker.canPick(G)).toBeTruthy();
  const [, pickedEnergy] = picker.pick(G);

  // Assert
  expect(pickedEnergy).toBe(EnergyType.Black);
});

test("Throws an Error if asked for energy from outside of EnergyRow range", () => {
  // Arrange
  const G = new GameS({
    dispenser: new EnergyTypeDictionary(5, 5, 5, 5, 0),
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Yellow, EnergyType.Black, EnergyType.Yellow],
  });
  const picker = From.Dispenser(pickNth(150));

  // Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
  expect(() => picker.pick(G)).toThrowError();
});

test("CanPick does not modify the original game state", () => {
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
  const picker = From.Dispenser(pickNth(13));

  // Act
  picker.canPick(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

test("Pick does not modify the original game state", () => {
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
  const picker = From.Dispenser(pickNth(13));

  // Act
  picker.pick(G);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

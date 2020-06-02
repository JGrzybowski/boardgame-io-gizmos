import { To } from "./To";
import { GameS } from "../gameState";
import { EnergyType } from "../energyType";

test("Adds provided energy at the end of energy row", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
  });

  const putter = To.EnergyRow();

  // Act
  expect(putter.canPut(G, EnergyType.Red)).toBeTruthy();
  const afterPut = putter.put(G, EnergyType.Red);

  // Assert
  expect(afterPut.energyRow[0]).toBe(EnergyType.Blue);
  expect(afterPut.energyRow[1]).toBe(EnergyType.Black);
  expect(afterPut.energyRow[2]).toBe(EnergyType.Red);
});

test("throws an error if trying to add Any energy", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
  });

  const putter = To.EnergyRow();

  // Act && Assert
  expect(putter.canPut(G, EnergyType.Any)).toBeFalsy();
  expect(() => putter.put(G, EnergyType.Any)).toThrowError();
});

test("throws an error if trying to add energy to full Energy Row", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black, EnergyType.Yellow],
    energyRowSize: 3,
  });

  const putter = To.EnergyRow();

  // Act && Assert
  expect(putter.canPut(G, EnergyType.Red)).toBeFalsy();
  expect(() => putter.put(G, EnergyType.Red)).toThrowError();
});

test("CanPut does not modify original game state", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
  });

  const originalGameState = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
  });

  const putter = To.EnergyRow();

  // Act
  putter.canPut(G, EnergyType.Red);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

test("Put does not modify original game state", () => {
  // Arrange
  const G = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
  });

  const originalGameState = new GameS({
    energyRow: [EnergyType.Blue, EnergyType.Black],
  });

  const putter = To.EnergyRow();

  // Act
  putter.put(G, EnergyType.Red);

  // Assert
  expect(G).toMatchObject(originalGameState);
});

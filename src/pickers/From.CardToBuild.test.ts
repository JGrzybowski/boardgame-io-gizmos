import { TestCard } from "../test/TestCard";
import { GameS } from "../gameState";
import { From } from "./From";

test("Card is taken from the built slot", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(10, 1),
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.CardToBuild();

  //Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick, pickedCard] = picker.pick(G);

  //Assert
  expect(afterPick.cardToBeBuilt).toBeNull();
  expect(pickedCard).toMatchObject(TestCard(10, 1));
});

test("Throws an error if there is no card in the slot", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: null,
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.CardToBuild();

  //Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
});

test("CanPick does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(10, 1),
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const originalGameState = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(10, 1),
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.CardToBuild();

  //Act
  picker.canPick(G);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Pick does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(10, 1),
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const originalGameState = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(10, 1),
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.CardToBuild();

  //Act
  picker.pick(G);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Sets Card's cost to null", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(10, 1),
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.CardToBuild();

  //Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  //Assert
  expect(afterPick.cardToBeBuiltCost).not.toBeUndefined();
  expect(afterPick.cardToBeBuiltCost).toBeNull();
});

test("Sets Card's source to null", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(10, 1),
    cardToBeBuiltSource: "Table",
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.CardToBuild();

  //Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  //Assert
  expect(afterPick.cardToBeBuiltSource).not.toBeUndefined();
  expect(afterPick.cardToBeBuiltSource).toBeNull();
});

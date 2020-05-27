import { TestCard } from "./test/TestCard";
import { GameS } from "./gameState";
import { From } from "./From";

test("Card is taken from the built slot", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: new TestCard(10, 1),
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [afterPick, pickedCard] = From.CardToBuild()(G);

  //Assert
  expect(afterPick.cardToBeBuilt).toBeNull();
  expect(pickedCard).toMatchObject(new TestCard(10, 1));
});

test("Throws an error if there is no card in the slot", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act & Assert
  expect(() => From.CardToBuild()(G)).toThrowError();
});

test("Does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: new TestCard(10, 1),
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const originalGameState = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: new TestCard(10, 1),
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  From.CardToBuild()(G);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Sets Card's cost to null", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: new TestCard(10, 1),
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [afterPick] = From.CardToBuild()(G);

  //Assert
  expect(afterPick.cardToBeBuiltCost).not.toBeUndefined();
  expect(afterPick.cardToBeBuiltCost).toBeNull();
});

test("Removes only card to be build from cards pile", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: new TestCard(10, 1),
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [afterPick] = From.CardToBuild()(G);

  //Assert
  expect(afterPick.cards.map((c) => c.cardId)).not.toContain(10);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(11);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(12);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(13);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(14);
});

import { GameS } from "../gameState";
import { From } from "./From";
import { TestCard } from "../test/TestCard";

test("Should remove amount of cards it was asked", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1), TestCard(15, 1), TestCard(16, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 2);

  //Act
  expect(picker.canPickMultiple(G)).toBeTruthy();
  const [gameStateAfterPut, pickedCards] = picker.pickMultiple(G);

  //Assert
  expect(gameStateAfterPut.visibleCards).toHaveLength(2);
  expect(pickedCards).toHaveLength(2);
});

test("Should not take more cards from pile", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1), TestCard(15, 1), TestCard(16, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 2);

  //Act
  expect(picker.canPickMultiple(G)).toBeTruthy();
  const [gameStateAfterPut] = picker.pickMultiple(G);

  //Assert
  expect(gameStateAfterPut.pileCards).toHaveLength(3);
  expect(gameStateAfterPut.pileCards).toContainEqual(TestCard(14, 1));
  expect(gameStateAfterPut.pileCards).toContainEqual(TestCard(15, 1));
  expect(gameStateAfterPut.pileCards).toContainEqual(TestCard(16, 1));
});

test("Should skip cards visible on the table", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1), TestCard(15, 1), TestCard(16, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 2);

  //Act
  expect(picker.canPickMultiple(G)).toBeTruthy();
  const [gameStateAfterPut] = picker.pickMultiple(G);

  //Assert
  expect(gameStateAfterPut.visibleCards).toHaveLength(2);
  expect(gameStateAfterPut.visibleCards).toContainEqual(TestCard(10, 1));
  expect(gameStateAfterPut.visibleCards).toContainEqual(TestCard(11, 1));
});

test("Order is not disrupted", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1), TestCard(15, 1), TestCard(16, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 2);

  //Act
  expect(picker.canPickMultiple(G)).toBeTruthy();
  const [gameStateAfterPut] = picker.pickMultiple(G);
  //Assert
  expect(gameStateAfterPut.pileCards.map((c) => c.cardId)).toMatchObject([14, 15, 16]);
});

test("Returns picked cards", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1), TestCard(15, 1), TestCard(16, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 2);

  //Act
  expect(picker.canPickMultiple(G)).toBeTruthy();
  const [, pickedCards] = picker.pickMultiple(G);

  //Assert
  expect(pickedCards).toHaveLength(2);
  expect(pickedCards).toContainEqual(TestCard(12, 1));
  expect(pickedCards).toContainEqual(TestCard(13, 1));
});

test("Does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1), TestCard(15, 1), TestCard(16, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1), TestCard(15, 1), TestCard(16, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 2);

  //Act
  expect(picker.canPickMultiple(G)).toBeTruthy();
  picker.pickMultiple(G);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Returns all remaining cards from pile if there is less of them than asked number ", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 5);

  //Act
  expect(picker.canPickMultiple(G)).toBeTruthy();
  const [, pickedCards] = picker.pickMultiple(G);

  //Assert
  expect(pickedCards).toHaveLength(3);
  expect(pickedCards.map((c) => c.cardId)).toMatchObject([12, 13, 14]);
});

test("Throws an Error if there are no cards on the pile.", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.TopOfPile(1, 5);

  //Act & Assert
  expect(picker.canPickMultiple(G)).toBeFalsy();
  expect(() => picker.pickMultiple(G)).toThrowError();
});

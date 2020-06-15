import { TestCard } from "../test/TestCard";
import { GameS } from "../gameState";
import { To } from "./To";

test("Increases number of cards on the table", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [TestCard(11, 1)];
  const putter = To.VisibleCards();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.visibleCards).toHaveLength(2);
});

test("Adds given cards to the pile", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [TestCard(11, 1)];
  const putter = To.VisibleCards();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.visibleCards).toContainEqual(TestCard(11, 1));
});

test("Throws Error if the number of cards overflows the limit of cards on the table", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    visibleCardsLimits: [0, 3, 2, 2],
  });
  const cardsToPut = [TestCard(12, 1), TestCard(13, 1)];
  const putter = To.VisibleCards();

  //Act & Assert
  expect(putter.canPutMultiple(G, cardsToPut)).toBeFalsy();
  expect(() => putter.putMultiple(G, cardsToPut)).toThrowError();
});

test("CanPut does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    visibleCards: [TestCard(10, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [TestCard(11, 1)];
  const putter = To.VisibleCards();

  //Act
  putter.canPutMultiple(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Put does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    visibleCards: [TestCard(10, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [TestCard(11, 1)];
  const putter = To.VisibleCards();

  //Act
  putter.putMultiple(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

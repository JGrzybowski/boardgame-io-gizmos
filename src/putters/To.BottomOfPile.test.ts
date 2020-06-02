import { TestCard } from "../test/TestCard";
import { GameS } from "../gameState";
import { To } from "./To";

test("Increases number of cards on the table", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.cards).toHaveLength(8);
});

test("Adds given cards to the pile", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.cards.map((c) => c.cardId)).toContain(15);
  expect(afterPut.cards.map((c) => c.cardId)).toContain(16);
  expect(afterPut.cards.map((c) => c.cardId)).toContain(17);
});

test("Leaves the previous cards of the pile on the top and in the same order", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.cards.slice(0, G.cards.length).map((c) => c.cardId)).toMatchObject([10, 11, 12, 13, 14]);
});

test("CanPut does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  putter.canPutMultiple(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Put does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  putter.putMultiple(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

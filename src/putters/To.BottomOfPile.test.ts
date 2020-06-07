import { TestCard } from "../test/TestCard";
import { GameS } from "../gameState";
import { To } from "./To";

test("Increases number of cards on the table", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
    pileCards: [new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.pileCards).toHaveLength(6);
});

test("Adds given cards to the pile", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
    pileCards: [new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.pileCards).toContainEqual(new TestCard(15, 1));
  expect(afterPut.pileCards).toContainEqual(new TestCard(16, 1));
  expect(afterPut.pileCards).toContainEqual(new TestCard(17, 1));
});

test("Leaves the previous cards of the pile on the top and in the same order", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
    pileCards: [new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.pileCards.slice(0, G.pileCards.length).map((c) => c.cardId)).toMatchObject([12, 13, 14]);
});

test("CanPut does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
    pileCards: [new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
    pileCards: [new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
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
    visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
    pileCards: [new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
    pileCards: [new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardsToPut = [new TestCard(15, 1), new TestCard(16, 1), new TestCard(17, 1)];
  const putter = To.BottomOfPile();

  //Act
  putter.putMultiple(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

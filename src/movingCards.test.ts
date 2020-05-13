import { GameS } from "./gameState";
import { From } from "./from";
import { TestCard } from "./test/TestCard";

test("Should remove amount of cards it was asked", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [afterPickOne, pickedCards] = From.TopOfPile(1, 2)(G);

  //Assert
  expect(afterPickOne.cards).toHaveLength(3);
  expect(pickedCards).toHaveLength(2);
});

test("Should not take more cards from pile", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [afterPickOne] = From.TopOfPile(1, 2)(G);

  //Assert
  expect(afterPickOne.cards.map((c) => c.cardId)).toContain(14);
});

test("Should skip cards visible on the table", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [afterPickOne] = From.TopOfPile(1, 2)(G);

  //Assert
  expect(afterPickOne.cards.map((c) => c.cardId)).toContain(10);
  expect(afterPickOne.cards.map((c) => c.cardId)).toContain(11);
});

test("Order is not disrupted", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [afterPickOne] = From.TopOfPile(1, 2)(G);

  //Assert
  expect(afterPickOne.cards.map((c) => c.cardId)).toMatchObject([10, 11, 14]);
});

test("Returns picked cards", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [, pickedCards] = From.TopOfPile(1, 2)(G);

  //Assert
  expect(pickedCards.map((c) => c.cardId)).toContain(12);
  expect(pickedCards.map((c) => c.cardId)).toContain(13);
});

test("Does not modify the original state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const gBeforePick = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  From.TopOfPile(1, 2)(G);

  //Assert
  expect(G).toMatchObject(gBeforePick);
});

test("Returns all remaining cards from pile if there is less of them than asked number ", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [, pickedCards] = From.TopOfPile(1, 5)(G);

  //Assert
  expect(pickedCards).toHaveLength(3);
  expect(pickedCards.map((c) => c.cardId)).toMatchObject([12, 13, 14]);
});

test("Returns empty collection if there are no cards on the pile.", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act
  const [, pickedCards] = From.TopOfPile(1, 5)(G);

  //Assert
  expect(pickedCards).toHaveLength(0);
});

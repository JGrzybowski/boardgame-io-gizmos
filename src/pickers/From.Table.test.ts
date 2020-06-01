import { GameS } from "../gameState";
import { From } from "./From";
import { TestCard } from "../test/TestCard";

test("Should remove one card with given id from table", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.Table(11);

  //Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  //Assert
  expect(afterPick.cards.map((c) => c.cardId)).not.toContain(11);
});

test("Should not take more cards from table", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.Table(11);

  //Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  //Assert
  expect(afterPick.cards).toHaveLength(4);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(10);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(12);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(13);
  expect(afterPick.cards.map((c) => c.cardId)).toContain(14);
});

test("Does not change order of the other cards", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.Table(11);

  //Act
  expect(picker.canPick(G)).toBeTruthy();
  const [afterPick] = picker.pick(G);

  //Assert
  expect(afterPick.cards.map((c) => c.cardId)).toMatchObject([10, 12, 13, 14]);
});

test("Returns picked card", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.Table(11);

  //Act
  expect(picker.canPick(G)).toBeTruthy();
  const [, pickedCard] = picker.pick(G);

  //Assert
  expect(pickedCard).toMatchObject(new TestCard(11, 1));
});

test("CanPick does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.Table(11);

  //Act
  picker.canPick(G);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Pick does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const originalGameState = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.Table(11);

  //Act
  picker.pick(G);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Throws Error if card is in the pile", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });

  //Act & Assert
  expect(From.Table(12).canPick(G)).toBeFalsy();
  expect(From.Table(13).canPick(G)).toBeFalsy();
  expect(From.Table(14).canPick(G)).toBeFalsy();
  expect(() => From.Table(12).pick(G)).toThrowError();
  expect(() => From.Table(13).pick(G)).toThrowError();
  expect(() => From.Table(14).pick(G)).toThrowError();
});

test("Throws Error if card is not on the table", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const picker = From.Table(18);

  //Act & Assert
  expect(picker.canPick(G)).toBeFalsy();
  expect(() => picker.pick(G)).toThrowError();
});

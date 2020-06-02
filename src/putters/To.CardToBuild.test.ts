import { TestCard, TestCardWithCost } from "../test/TestCard";
import { GameS } from "../gameState";
import { To } from "./To";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { EnergyType } from "../basicGameElements";

test("Card is put into card into card slot", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardToPut = new TestCard(15, 1);
  const putter = To.CardToBuild();

  //Act
  expect(putter.canPut(G, cardToPut)).toBeTruthy();
  const afterPut = putter.put(G, cardToPut);

  //Assert
  expect(afterPut.cardToBeBuilt).not.toBeNull();
  expect(afterPut.cardToBeBuilt).toMatchObject(new TestCard(15, 1));
});

test("Throws error if the card to be built slot is occupied", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: new TestCard(15, 1),
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = new TestCard(17, 1);
  const putter = To.CardToBuild();

  //Act & Assert
  expect(putter.canPut(G, cardToPut)).toBeFalsy();
  expect(() => putter.put(G, cardToPut)).toThrowError();
});

test("CanPut does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const originalGameState = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = new TestCard(15, 1);
  const putter = To.CardToBuild();

  //Act
  putter.canPut(G, cardToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Put does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const originalGameState = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = new TestCard(15, 1);
  const putter = To.CardToBuild();

  //Act
  putter.put(G, cardToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Sets Up Cards cost", () => {
  //Arrange
  const G = new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = new TestCardWithCost(15, 1, EnergyType.Red, 3);
  const putter = To.CardToBuild();

  //Act
  expect(putter.canPut(G, cardToPut)).toBeTruthy();
  const afterPut = putter.put(G, cardToPut);

  //Assert
  expect(afterPut.cardToBeBuiltCost).not.toBeUndefined();
  expect(afterPut.cardToBeBuiltCost).not.toBeNull();
  expect(afterPut.cardToBeBuiltCost).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Red, 3));
});

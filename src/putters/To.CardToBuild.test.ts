import { TestCard, TestCardWithCost } from "../test/TestCard";
import { GameS, isBuildSource } from "../gameState";
import { To } from "./To";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { EnergyType } from "../energyType";

test("Card is put into card into card slot", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const cardToPut = TestCard(15, 1);
  const putter = To.CardToBuild("Table");

  //Act
  expect(putter.canPut(G, cardToPut)).toBeTruthy();
  const afterPut = putter.put(G, cardToPut);

  //Assert
  expect(afterPut.cardToBeBuilt).not.toBeNull();
  expect(afterPut.cardToBeBuilt).toMatchObject(TestCard(15, 1));
});

test("Throws error if the card to be built slot is occupied", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: TestCard(15, 1),
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = TestCard(17, 1);
  const putter = To.CardToBuild("Table");

  //Act & Assert
  expect(putter.canPut(G, cardToPut)).toBeFalsy();
  expect(() => putter.put(G, cardToPut)).toThrowError();
});

test("CanPut does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const originalGameState = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = TestCard(15, 1);
  const putter = To.CardToBuild("Table");

  //Act
  putter.canPut(G, cardToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Put does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const originalGameState = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = TestCard(15, 1);
  const putter = To.CardToBuild("Table");

  //Act
  putter.put(G, cardToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Sets Up Cards cost", () => {
  //Arrange
  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = TestCardWithCost(15, 1, EnergyType.Red, 3);
  const putter = To.CardToBuild("Table");

  //Act
  expect(putter.canPut(G, cardToPut)).toBeTruthy();
  const afterPut = putter.put(G, cardToPut);

  //Assert
  expect(afterPut.cardToBeBuiltCost).not.toBeUndefined();
  expect(afterPut.cardToBeBuiltCost).not.toBeNull();
  expect(afterPut.cardToBeBuiltCost).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Red, 3));
});

test.each(["Archive", "Table", "Research"])("Sets Up Cards source", (source) => {
  //Arrange
  if (!isBuildSource(source)) throw new Error(`The selected source ${source} is not a BuildSource`);

  const G = new GameS({
    visibleCards: [TestCard(10, 1), TestCard(11, 1)],
    pileCards: [TestCard(12, 1), TestCard(13, 1), TestCard(14, 1)],
    cardToBeBuilt: null,
    visibleCardsLimits: [0, 2, 2, 2],
  });

  const cardToPut = TestCardWithCost(15, 1, EnergyType.Red, 3);
  const putter = To.CardToBuild(source);

  //Act
  expect(putter.canPut(G, cardToPut)).toBeTruthy();
  const afterPut = putter.put(G, cardToPut);

  //Assert
  expect(afterPut.cardToBeBuiltSource).not.toBeUndefined();
  expect(afterPut.cardToBeBuiltSource).not.toBeNull();
  expect(afterPut.cardToBeBuiltSource).toBe(source);
});

import { TestCard } from "./test/TestCard";
import { GameS } from "./gameState";
import { To } from "./To";
import { PlayerState } from "./playerState";

test("Cards are put into cards revealed to the player", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const cardsToPut = [new TestCard(15, 1), new TestCard(20, 2)];

  //Act
  const afterPut = To.PlayerResearched("0")(G, cardsToPut);

  //Assert
  expect(afterPut.players["0"].researched).toHaveLength(3);
  expect(afterPut.players["0"].researched.map((c) => c.cardId)).toContain(15);
  expect(afterPut.players["0"].researched.map((c) => c.cardId)).toContain(20);
});

test("Does not change the other players", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const cardsToPut = [new TestCard(15, 1), new TestCard(20, 2)];

  //Act
  const afterPut = To.PlayerResearched("0")(G, cardsToPut);

  //Assert
  expect(afterPut.players["1"]).toMatchObject(originalGameState.players["1"]);
  expect(afterPut.players["1"]).toMatchObject(
    new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 })
  );
});

test("Does not remove any other cards previously owned by the player", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const cardsToPut = [new TestCard(15, 1), new TestCard(20, 2)];

  //Act
  const afterPut = To.PlayerResearched("0")(G, cardsToPut);

  //Assert
  expect(afterPut.players["0"].machines).toHaveLength(1);
  expect(afterPut.players["0"].machines.map((c) => c.cardId)).toContain(11);
});

test("Does not remove any other cards previously researched by the player", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const cardsToPut = [new TestCard(15, 1), new TestCard(12, 2)];

  //Act
  const afterPut = To.PlayerResearched("0")(G, cardsToPut);

  //Assert
  expect(afterPut.players["0"].researched).toHaveLength(3);
  expect(afterPut.players["0"].researched.map((c) => c.cardId)).toContain(11);
});

test("Does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const cardsToPut = [new TestCard(15, 1)];

  //Act
  To.PlayerResearched("0")(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Throws an Error if the total number of cards in player's researched would be above the limit", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 1 }),
      "1": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 1 }),
    },
  });

  const cardsToPut = [new TestCard(15, 1)];

  //Act & Assert
  expect(() => To.PlayerResearched("0")(G, cardsToPut)).toThrowError();
});

test("Throws an Error if there is no player with given Id", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", researched: [new TestCard(11, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
    },
  });

  const cardsToPut = [new TestCard(15, 1)];

  //Act & Assert
  expect(() => To.PlayerResearched("NonExistingPlayer")(G, cardsToPut)).toThrowError();
});

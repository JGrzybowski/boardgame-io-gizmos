import { TestCard } from "./test/TestCard";
import { GameS } from "./gameState";
import { To } from "./To";
import { PlayerState } from "./playerState";

test("Cards are put into player's cards collection", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
    },
  });

  const cardsToPut = [new TestCard(15, 1), new TestCard(20, 2)];

  //Act
  const afterPut = To.PlayerCards("0")(G, cardsToPut);

  //Assert
  expect(afterPut.players["0"].machines).toHaveLength(3);
  expect(afterPut.players["0"].machines.map((c) => c.cardId)).toContain(15);
  expect(afterPut.players["0"].machines.map((c) => c.cardId)).toContain(20);
});

test("Does not change the other players", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
    },
  });

  const cardsToPut = [new TestCard(15, 1), new TestCard(20, 2)];

  //Act
  const afterPut = To.PlayerCards("0")(G, cardsToPut);

  //Assert
  expect(afterPut.players["1"]).toMatchObject(originalGameState.players["1"]);
  expect(afterPut.players["1"]).toMatchObject(new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }));
});

test("Does not remove any other cards previously owned by the player", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
    },
  });

  const cardsToPut = [new TestCard(15, 1), new TestCard(20, 2)];

  //Act
  const afterPut = To.PlayerCards("0")(G, cardsToPut);

  //Assert
  expect(afterPut.players["0"].machines).toHaveLength(3);
  expect(afterPut.players["0"].machines.map((c) => c.cardId)).toContain(11);
});

test("Does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
    },
  });

  const cardsToPut = [new TestCard(15, 1)];

  //Act
  To.PlayerCards("0")(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Throws an Error if there is no player with given Id", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "0", machines: [new TestCard(11, 1)] }),
    },
  });

  const cardsToPut = [new TestCard(15, 1)];

  //Act & Assert
  expect(() => To.PlayerCards("NonExistingPlayer")(G, cardsToPut)).toThrowError();
});

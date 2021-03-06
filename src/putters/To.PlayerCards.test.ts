import { TestCard } from "../test/TestCard";
import { GameS } from "../gameState";
import { To } from "./To";
import { PlayerState } from "../playerState";

test("Cards are put into player's cards collection", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const cardsToPut = [TestCard(15, 1), TestCard(20, 2)];
  const putter = To.PlayerCards("0");

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.players["0"].machines).toHaveLength(3);
  expect(afterPut.players["0"].machines.map((c) => c.cardId)).toContain(15);
  expect(afterPut.players["0"].machines.map((c) => c.cardId)).toContain(20);
});

test("Does not change the other players", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const cardsToPut = [TestCard(15, 1), TestCard(20, 2)];
  const putter = To.PlayerCards("0");

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.players["1"]).toMatchObject(originalGameState.players["1"]);
  expect(afterPut.players["1"]).toMatchObject(new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }));
});

test("Does not remove any other cards previously owned by the player", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const cardsToPut = [TestCard(15, 1), TestCard(20, 2)];
  const putter = To.PlayerCards("0");

  //Act
  expect(putter.canPutMultiple(G, cardsToPut)).toBeTruthy();
  const afterPut = putter.putMultiple(G, cardsToPut);

  //Assert
  expect(afterPut.players["0"].machines).toHaveLength(3);
  expect(afterPut.players["0"].machines.map((c) => c.cardId)).toContain(11);
});

test("CanPut does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const cardsToPut = [TestCard(15, 1)];
  const putter = To.PlayerCards("0");

  //Act
  putter.canPutMultiple(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Put does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const cardsToPut = [TestCard(15, 1)];
  const putter = To.PlayerCards("0");

  //Act
  putter.putMultiple(G, cardsToPut);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Throws an Error if there is no player with given Id", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({ playerId: "0", machines: [TestCard(11, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
  });

  const cardsToPut = [TestCard(15, 1)];
  const putter = To.PlayerCards("NonExistingPlayer");

  //Act & Assert
  expect(putter.canPutMultiple(G, cardsToPut)).toBeFalsy();
  expect(() => putter.putMultiple(G, cardsToPut)).toThrowError();
});

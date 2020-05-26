import { TestCard } from "./test/TestCard";
import { GameS } from "./gameState";
import { PlayerState } from "./playerState";
import { From } from "./From";

test("Card with given ID is taken from player's archive collection", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  //Act
  const [afterPick, pickedCards] = From.PlayerArchive("0", 11)(G);

  //Assert
  expect(pickedCards).toHaveLength(1);
  expect(pickedCards.map((c) => c.cardId)).toContain(11);
});

test("Preserves other archive cards in the collection", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  //Act
  const [afterPick, pickedCards] = From.PlayerArchive("0", 11)(G);

  //Assert
  expect(afterPick.players["0"].archive).toHaveLength(2);
  expect(afterPick.players["0"].archive.map((c) => c.cardId)).toContain(10);
  expect(afterPick.players["0"].archive.map((c) => c.cardId)).toContain(12);
});

test("Throws Error if the player's archive collection does not contain card with given id", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  //Act & Assert
  expect(() => From.PlayerArchive("0", 21)(G)).toThrowError();
});

test("Throws Error if the player's archive collection is empty", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  //Act & Assert
  expect(() => From.PlayerArchive("0", 11)(G)).toThrowError();
});

test("Does not modify the original game state", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  //Act
  From.PlayerArchive("0", 11)(G);

  //Assert
  expect(G).toMatchObject(originalGameState);
});

test("Does not modify the the other player state", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  const originalGameState = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  //Act
  const [afterPick, pickedCards] = From.PlayerArchive("0", 11)(G);

  //Assert
  expect(afterPick.players["1"]).toMatchObject(originalGameState.players["1"]);
  expect(afterPick.players["1"]).toMatchObject(
    new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 })
  );
});

test("Throws an Error if there is no player with given Id", () => {
  //Arrange
  const G = new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
        archiveLimit: 3,
      }),
      "1": new PlayerState({ playerId: "1", archive: [new TestCard(21, 2)], archiveLimit: 3 }),
    },
  });

  //Act & Assert
  expect(() => From.PlayerArchive("NonExistingPlayer", 11)(G)).toThrowError();
});

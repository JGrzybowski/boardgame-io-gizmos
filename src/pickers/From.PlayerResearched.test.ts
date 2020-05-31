import { TestCard } from "../test/TestCard";
import { GameS } from "../gameState";
import { PlayerState } from "../playerState";
import { From } from "./From";

describe("When card Id was not provided", () => {
  test("All cards are taken from player's researched collection", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    const [afterPick, pickedCards] = From.PlayerResearched("0")(G);

    //Assert
    expect(pickedCards).toHaveLength(3);
    expect(pickedCards.map((c) => c.cardId)).toContain(10);
    expect(pickedCards.map((c) => c.cardId)).toContain(11);
    expect(pickedCards.map((c) => c.cardId)).toContain(12);
  });

  test("Player's researched collection is set to empty array", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    const [afterPick, pickedCards] = From.PlayerResearched("0")(G);

    //Assert
    expect(afterPick.players["0"].researched).toHaveLength(0);
  });

  test("Throws Error if the player's researched collection is empty", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act & Assert
    expect(() => From.PlayerResearched("0")(G)).toThrowError();
  });

  test("Does not modify the original game state", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    const originalGameState = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    From.PlayerResearched("0")(G);

    //Assert
    expect(G).toMatchObject(originalGameState);
  });

  test("Does not modify the the other player state", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    const originalGameState = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    const [afterPick, pickedCards] = From.PlayerResearched("0")(G);

    //Assert
    expect(afterPick.players["1"]).toMatchObject(originalGameState.players["1"]);
    expect(afterPick.players["1"]).toMatchObject(
      new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 })
    );
  });

  test("Throws an Error if there is no player with given Id", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act & Assert
    expect(() => From.PlayerResearched("NonExistingPlayer")(G)).toThrowError();
  });
});

describe("When card Id was provided", () => {
  test("Card with given ID is taken from player's researched collection", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    const [afterPick, pickedCard] = From.PlayerResearched("0", 11)(G);

    //Assert
    expect(pickedCard).toMatchObject(new TestCard(11, 1));
  });

  test("Preserves other researched cards in the collection", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    const [afterPick, pickedCard] = From.PlayerResearched("0", 11)(G);

    //Assert
    expect(afterPick.players["0"].researched).toHaveLength(2);
    expect(afterPick.players["0"].researched.map((c) => c.cardId)).toContain(10);
    expect(afterPick.players["0"].researched.map((c) => c.cardId)).toContain(12);
  });

  test("Throws Error if the player's researched collection does not contain card with given id", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act & Assert
    expect(() => From.PlayerResearched("0", 21)(G)).toThrowError();
  });

  test("Throws Error if the player's researched collection is empty", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act & Assert
    expect(() => From.PlayerResearched("0", 11)(G)).toThrowError();
  });

  test("Does not modify the original game state", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    const originalGameState = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    From.PlayerResearched("0", 11)(G);

    //Assert
    expect(G).toMatchObject(originalGameState);
  });

  test("Does not modify the the other player state", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    const originalGameState = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act
    const [afterPick, pickedCard] = From.PlayerResearched("0", 11)(G);

    //Assert
    expect(afterPick.players["1"]).toMatchObject(originalGameState.players["1"]);
    expect(afterPick.players["1"]).toMatchObject(
      new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 })
    );
  });

  test("Throws an Error if there is no player with given Id", () => {
    //Arrange
    const G = new GameS({
      players: {
        "0": new PlayerState({
          playerId: "0",
          researched: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1)],
          researchLimit: 3,
        }),
        "1": new PlayerState({ playerId: "1", researched: [new TestCard(21, 2)], researchLimit: 3 }),
      },
    });

    //Act & Assert
    expect(() => From.PlayerResearched("NonExistingPlayer", 11)(G)).toThrowError();
  });
});

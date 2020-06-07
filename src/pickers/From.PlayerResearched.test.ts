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
    const picker = From.PlayerResearched("0");

    //Act
    expect(picker.canPickMultiple(G)).toBeTruthy();
    const [, pickedCards] = picker.pickMultiple(G);

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
    const picker = From.PlayerResearched("0");

    //Act
    expect(picker.canPickMultiple(G)).toBeTruthy();
    const [afterPick] = picker.pickMultiple(G);

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
    const picker = From.PlayerResearched("0");

    //Act & Assert
    expect(picker.canPickMultiple(G)).toBeFalsy();
    expect(() => picker.pickMultiple(G)).toThrowError();
  });

  test("CanPick does not modify the original game state", () => {
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
    const picker = From.PlayerResearched("0");

    //Act
    picker.canPickMultiple(G);

    //Assert
    expect(G).toMatchObject(originalGameState);
  });

  test("Pick does not modify the original game state", () => {
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
    const picker = From.PlayerResearched("0");

    //Act
    picker.pickMultiple(G);

    //Assert
    expect(G).toMatchObject(originalGameState);
  });

  test("Pick does not modify the the other player state", () => {
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
    const picker = From.PlayerResearched("0");

    //Act
    expect(picker.canPickMultiple(G)).toBeTruthy();
    const [afterPick] = picker.pickMultiple(G);

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
    const picker = From.PlayerResearched("NonExistingPlayer");

    //Act & Assert
    expect(picker.canPickMultiple(G)).toBeFalsy();
    expect(() => picker.pickMultiple(G)).toThrowError();
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
    const picker = From.PlayerResearched("0", 11);

    //Act
    expect(picker.canPick(G)).toBeTruthy();
    const [, pickedCard] = picker.pick(G);

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
    const picker = From.PlayerResearched("0", 11);

    //Act
    expect(picker.canPick(G)).toBeTruthy();
    const [afterPick] = picker.pick(G);

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
    const picker = From.PlayerResearched("0", 21);

    //Act & Assert
    expect(picker.canPick(G)).toBeFalsy();
    expect(() => picker.pick(G)).toThrowError();
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
    const picker = From.PlayerResearched("0", 11);

    //Act & Assert
    expect(picker.canPick(G)).toBeFalsy();
    expect(() => picker.pick(G)).toThrowError();
  });

  test("CanPick does not modify the original game state", () => {
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
    const picker = From.PlayerResearched("0", 11);

    //Act
    picker.canPick(G);

    //Assert
    expect(G).toMatchObject(originalGameState);
  });

  test("Pick does not modify the original game state", () => {
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
    const picker = From.PlayerResearched("0", 11);

    //Act
    picker.pick(G);

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

    const picker = From.PlayerResearched("0", 11);

    //Act
    expect(picker.canPick(G)).toBeTruthy();
    const [afterPick] = picker.pick(G);

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
    const picker = From.PlayerResearched("NonExistingPlayer", 11);

    //Act & Assert
    expect(picker.canPick(G)).toBeFalsy();
    expect(() => picker.pick(G)).toThrowError();
  });
});

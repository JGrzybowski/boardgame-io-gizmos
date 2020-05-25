import { GameS, GameState } from "../gameState";
import { TestCard, TestCardWithCost } from "../test/TestCard";
import { PlayerState } from "../playerState";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { GameContext } from "../gameContext";
import { EnergyType } from "../basicGameElements";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { researchStage } from "../stages/researchStage";

function InitialTestScenario() {
  return new GameS({
    cards: [
      new TestCardWithCost(10, 1, EnergyType.Red, 1),
      new TestCardWithCost(11, 1, EnergyType.Red, 2),
      new TestCardWithCost(12, 1, EnergyType.Red, 3),
      new TestCardWithCost(13, 1, EnergyType.Red, 4),
      new TestCardWithCost(14, 1, EnergyType.Red, 5),
    ],
    players: {
      "0": new PlayerState({
        playerId: "0",
        machines: [new TestCard(16, 1)],
        researched: [],
        researchLimit: 5,
      }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
}

test("removes specified card", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext) => {
      const G = InitialTestScenario();
      ctx.events?.setStage?.(researchStage.name);
      return G;
    },
  };

  const client = Client({
    game: GameCustomScenario,
    numPlayers: 2,
    playerID: "0",
  });

  client.moves.researchAction(1);

  // Act
  client.moves.buildFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState = afterMove.players["0"];
  expect(afterPlayerState.researched.map((c) => c.cardId)).not.toContain(12);
});

test("card is put into build slot", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext) => {
      const G = InitialTestScenario();
      return G;
    },
  };

  const client = Client({
    game: GameCustomScenario,
    numPlayers: 2,
    playerID: "0",
  });

  client.moves.researchAction(1);

  // Act
  client.moves.buildFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cardToBeBuilt).toMatchObject(new TestCardWithCost(12, 1, EnergyType.Red, 3));
});

test("removes other non specified cards", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext) => {
      const G = InitialTestScenario();
      ctx.events?.setStage?.(researchStage.name);
      return G;
    },
  };

  const client = Client({
    game: GameCustomScenario,
    numPlayers: 2,
    playerID: "0",
  });

  client.moves.researchAction(1);

  // Act
  client.moves.buildFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState = afterMove.players["0"];
  expect(afterPlayerState.researched).toHaveLength(0);
});

test("remaining cards are put on the bottom of the pile", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext) => {
      const G = InitialTestScenario();
      ctx.events?.setStage?.(researchStage.name);
      return G;
    },
  };

  const client = Client({
    game: GameCustomScenario,
    numPlayers: 2,
    playerID: "0",
  });

  client.moves.researchAction(1);

  // Act
  client.moves.buildFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const bottomOfThePile = afterMove.cards.slice(afterMove.cards.length - 4);
  expect(bottomOfThePile.map((c) => c.cardId)).toContain(10);
  expect(bottomOfThePile.map((c) => c.cardId)).toContain(11);
  expect(bottomOfThePile.map((c) => c.cardId)).toContain(13);
  expect(bottomOfThePile.map((c) => c.cardId)).toContain(14);
});

test("card cost is set up", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext) => {
      const G = InitialTestScenario();
      ctx.events?.setStage?.(researchStage.name);
      return G;
    },
  };

  const client = Client({
    game: GameCustomScenario,
    numPlayers: 2,
    playerID: "0",
  });

  client.moves.researchAction(1);

  // Act
  client.moves.buildFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cardToBeBuiltCost).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Red, 3));
});

test("can be undone", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext) => {
      const G = InitialTestScenario();
      ctx.events?.setStage?.(researchStage.name);
      return G;
    },
  };

  const client = Client({
    game: GameCustomScenario,
    numPlayers: 2,
    playerID: "0",
  });

  client.moves.researchAction(1);
  client.moves.buildFromResearchedAction(12);

  // Act
  client.undo();

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(InitialTestScenario());
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

test("returns invalid move if no card with given id", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext) => {
      const G = InitialTestScenario();
      ctx.events?.setStage?.(researchStage.name);
      return G;
    },
  };

  const client = Client({
    game: GameCustomScenario,
    numPlayers: 2,
    playerID: "0",
  });

  client.moves.researchAction(1);

  // Act
  client.moves.buildFromResearchedAction(120);

  // Assert
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

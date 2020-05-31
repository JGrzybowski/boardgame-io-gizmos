import { GameState, GameS } from "../gameState";
import { TestCardWithCost, TestCard } from "../test/TestCard";
import { EnergyType } from "../basicGameElements";
import { PlayerState } from "../playerState";
import { Game } from "boardgame.io";
import { GameContext } from "../gameContext";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { researchStage } from "../stages/researchStage";

function InitialTestScenario(): GameState {
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
        researchLimit: 3,
        archive: [],
        archiveLimit: 2,
      }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
}

function GameWithInitialTestScenario(initialTestScenario = InitialTestScenario()): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => initialTestScenario };
}

function TestClient(game: Game<GameState, GameContext>) {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("moves card into player's archive", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.archiveFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState: PlayerState = afterMove.players["0"];
  expect(afterPlayerState.archive).toContain(new TestCardWithCost(12, 1, EnergyType.Red, 3));
});

test("removes all the cards from researched", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.archiveFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState: PlayerState = afterMove.players["0"];
  expect(afterPlayerState.archive).toHaveLength(0);
  expect(afterPlayerState.archive).toContain(new TestCardWithCost(13, 1, EnergyType.Red, 4));
  expect(afterPlayerState.archive).toContain(new TestCardWithCost(14, 1, EnergyType.Red, 5));
  expect(afterPlayerState.archive).not.toContain(new TestCardWithCost(12, 1, EnergyType.Red, 3));
});

test("puts other researched cards on the bottom of the pile", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.archiveFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const cardsAfterMove = afterMove.cards;
  expect(cardsAfterMove).toContain(new TestCardWithCost(10, 1, EnergyType.Red, 1));
  expect(cardsAfterMove).toContain(new TestCardWithCost(11, 1, EnergyType.Red, 2));
  expect(cardsAfterMove).not.toContain(new TestCardWithCost(12, 1, EnergyType.Red, 3));

  expect(cardsAfterMove[cardsAfterMove.length - 1]).toMatchObject(new TestCardWithCost(10, 1, EnergyType.Red, 1));
  expect(cardsAfterMove[cardsAfterMove.length - 2]).toMatchObject(new TestCardWithCost(11, 1, EnergyType.Red, 2));
});

test("Returns invalid move if player's archive limit has been reached", () => {
  // Arrange
  const initialGameState = new GameS({
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
        researchLimit: 3,
        archive: [new TestCard(23, 2)],
        archiveLimit: 1,
      }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.archiveFromResearchedActionAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(initialGameState);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(researchStage.name);
});

test("Returns invalid move if player's archive ability has been blocked", () => {
  // Arrange
  const initialGameState = new GameS({
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
        researchLimit: 3,
        archive: [],
        archiveLimit: 3,
        isArchivingBlocked: true,
      }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.archiveFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(InitialTestScenario());
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

test("returns invalid move if provided card id not from the researched", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.archiveFromResearchedAction(234);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(InitialTestScenario());
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

test.skip("can't be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);
  client.moves.archiveFromResearchedAction(12);

  // Act
  client.undo();

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(InitialTestScenario());
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

import { GameState, GameS } from "../gameState";
import { TestCardWithCost, TestCard } from "../test/TestCard";
import { EnergyType } from "../energyType";
import { PlayerState } from "../playerState";
import { Game } from "boardgame.io";
import { GameContext } from "../gameContext";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { researchStage } from "../stages/researchStage";

function InitialTestScenario(): GameState {
  return new GameS({
    visibleCards: [new TestCardWithCost(10, 1, EnergyType.Red, 1), new TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [
      new TestCardWithCost(12, 1, EnergyType.Red, 3),
      new TestCardWithCost(13, 1, EnergyType.Red, 4),
      new TestCardWithCost(14, 1, EnergyType.Red, 5),
      new TestCardWithCost(15, 1, EnergyType.Red, 6),
      new TestCardWithCost(16, 1, EnergyType.Red, 7),
    ],
    players: {
      "0": new PlayerState({
        playerId: "0",
        machines: [new TestCard(21, 2)],
        researched: [],
        researchLimit: 3,
        archive: [],
        archiveLimit: 2,
      }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(22, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
}

function GameWithInitialTestScenario(initialTestScenario = InitialTestScenario()): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => initialTestScenario };
}

function TestClient(game: Game<GameState, GameContext>): any {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("moves card into player's archive", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  expect(client.store.getState().ctx.activePlayers?.["0"]).toBe(researchStage.name);
  client.moves.archiveFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState: PlayerState = afterMove.players["0"];
  expect(afterPlayerState.archive).toContainEqual(new TestCardWithCost(12, 1, EnergyType.Red, 3));
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
  expect(afterPlayerState.researched).toHaveLength(0);
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
  expect(afterMove.visibleCardsOfLevel(1)).toContainEqual(new TestCardWithCost(10, 1, EnergyType.Red, 1));
  expect(afterMove.visibleCardsOfLevel(1)).toContainEqual(new TestCardWithCost(11, 1, EnergyType.Red, 2));

  expect(afterMove.visibleCardsOfLevel(1)).not.toContainEqual(new TestCardWithCost(12, 1, EnergyType.Red, 3));
  expect(afterMove.pileCardsOfLevel(1)).not.toContainEqual(new TestCardWithCost(12, 1, EnergyType.Red, 3));

  expect(afterMove.pileCardsOfLevel(1).slice(-2)).toContainEqual(new TestCardWithCost(13, 1, EnergyType.Red, 4));
  expect(afterMove.pileCardsOfLevel(1).slice(-2)).toContainEqual(new TestCardWithCost(14, 1, EnergyType.Red, 5));
});

test("Returns invalid move if player's archive limit has been reached", () => {
  // Arrange
  const initialGameState = new GameS({
    visibleCards: [new TestCardWithCost(10, 1, EnergyType.Red, 1), new TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [
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
  const preMove: GameState = client.store.getState().G;

  // Act
  client.moves.archiveFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(researchStage.name);
});

test("Returns invalid move if player's archive ability has been blocked", () => {
  // Arrange
  const initialGameState = new GameS({
    visibleCards: [new TestCardWithCost(10, 1, EnergyType.Red, 1), new TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [
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
  const preMove: GameState = client.store.getState().G;

  // Act
  client.moves.archiveFromResearchedAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

test("returns invalid move if provided card id not from the researched", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);
  const preMove: GameState = client.store.getState().G;

  // Act
  client.moves.archiveFromResearchedAction(234);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject<GameState>(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

test.skip("can't be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);
  const preMove: GameState = client.store.getState().G;
  client.moves.archiveFromResearchedAction(12);

  // Act
  client.undo();

  // Assert
  const afterUndo: GameState = client.store.getState().G;
  expect(afterUndo).toMatchObject(preMove);
  const afterUndoCtx: GameContext = client.store.getState().ctx;
  expect(afterUndoCtx?.activePlayers?.["0"]).toBe(researchStage.name);
});

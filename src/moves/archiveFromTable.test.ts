import { GameState, GameS } from "../gameState";
import { TestCardWithCost, TestCard } from "../test/TestCard";
import { EnergyType } from "../energyType";
import { PlayerState } from "../playerState";
import { Game } from "boardgame.io";
import { GameContext } from "../gameContext";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { actionStage } from "../stages/actionStage";

function InitialTestScenario(): GameState {
  return new GameS({
    visibleCards: [TestCardWithCost(10, 1, EnergyType.Red, 1), TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [
      TestCardWithCost(12, 1, EnergyType.Red, 3),
      TestCardWithCost(13, 1, EnergyType.Red, 4),
      TestCardWithCost(14, 1, EnergyType.Red, 5),
      TestCardWithCost(15, 1, EnergyType.Red, 6),
      TestCardWithCost(16, 1, EnergyType.Red, 7),
    ],
    players: {
      "0": new PlayerState({
        playerId: "0",
        machines: [TestCard(21, 2)],
        archive: [],
        archiveLimit: 2,
      }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(22, 2)] }),
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

  // Act
  client.moves.archiveAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState: PlayerState = afterMove.players["0"];
  expect(afterPlayerState.archive).toContainEqual(TestCardWithCost(11, 1, EnergyType.Red, 2));
});

test("removes card from table", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.archiveAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.pileCardsOfLevel(1)).not.toContainEqual(TestCardWithCost(11, 1, EnergyType.Red, 2));
  expect(afterMove.visibleCardsOfLevel(1)).not.toContainEqual(TestCardWithCost(11, 1, EnergyType.Red, 2));
});

test("Puts another card from pile on the table", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.archiveAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.visibleCardsOfLevel(1)).toContainEqual(TestCardWithCost(10, 1, EnergyType.Red, 1));
  expect(afterMove.visibleCardsOfLevel(1)).toContainEqual(TestCardWithCost(12, 1, EnergyType.Red, 3));
});

test("Returns invalid move if player's archive limit has been reached", () => {
  // Arrange
  const initialGameState = new GameS({
    visibleCards: [TestCardWithCost(10, 1, EnergyType.Red, 1), TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [TestCardWithCost(12, 1, EnergyType.Red, 3)],
    players: {
      "0": new PlayerState({
        playerId: "0",
        machines: [TestCard(21, 2)],
        archive: [TestCard(23, 2)],
        archiveLimit: 1,
      }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(22, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  const preMove: GameState = client.store.getState().G;

  // Act
  client.moves.archiveAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test("Returns invalid move if player's archive ability has been blocked", () => {
  // Arrange
  const initialGameState = new GameS({
    visibleCards: [TestCardWithCost(10, 1, EnergyType.Red, 1), TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [TestCardWithCost(12, 1, EnergyType.Red, 3)],
    players: {
      "0": new PlayerState({
        playerId: "0",
        machines: [TestCard(21, 2)],
        archive: [TestCard(23, 2)],
        archiveLimit: 2,
        isArchivingBlocked: true,
      }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(22, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  const preMove: GameState = client.store.getState().G;

  // Act
  client.moves.archiveAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test("returns invalid move if provided card id not from the table", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  const preMove: GameState = client.store.getState().G;

  // Act
  client.moves.archiveAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test.skip("can't be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  const preMove: GameState = client.store.getState().G;
  client.moves.archiveAction(11);

  // Act
  client.undo();

  // Assert
  const afterUndo: GameState = client.store.getState().G;
  expect(afterUndo).toMatchObject(preMove);
  const afterUndoCtx: GameContext = client.store.getState().ctx;
  expect(afterUndoCtx?.activePlayers?.["0"]).toBe(actionStage.name);
});

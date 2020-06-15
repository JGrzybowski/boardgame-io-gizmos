import { GameS, GameState } from "../gameState";
import { TestCard, TestCardWithCost } from "../test/TestCard";
import { PlayerState } from "../playerState";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { Game } from "boardgame.io";
import { actionStage } from "../stages/actionStage";

function InitialTestScenario(): GameState {
  return new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        machines: [TestCard(16, 1)],
        researched: [],
        archive: [
          TestCardWithCost(10, 1, EnergyType.Red, 1),
          TestCardWithCost(11, 1, EnergyType.Red, 2),
          TestCardWithCost(12, 1, EnergyType.Red, 3),
          TestCardWithCost(13, 1, EnergyType.Red, 4),
          TestCardWithCost(14, 1, EnergyType.Red, 5),
        ],
        archiveLimit: 5,
      }),
      "1": new PlayerState({ playerId: "1", machines: [TestCard(21, 2)] }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
}

function GameWithInitialTestScenario(): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => InitialTestScenario() };
}

function TestClient(game: Game<GameState, GameContext>): any {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("card is removed from player's archive ", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromArchiveAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState = afterMove.players["0"];
  expect(afterPlayerState.archive.map((c) => c.cardId)).not.toContain(12);
});

test("card is moved into build slot", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromArchiveAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cardToBeBuilt).toMatchObject(TestCardWithCost(12, 1, EnergyType.Red, 3));
});

test("card cost is set up", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromArchiveAction(12);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cardToBeBuiltCost).not.toBeNull();
  expect(afterMove.cardToBeBuiltCost).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Red, 3));
});

test.skip("can be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromArchiveAction(12);

  // Act
  client.undo();

  // Assert
  const afterUndo: GameState = client.store.getState().G;
  expect(afterUndo).toMatchObject(InitialTestScenario());
});

test("returns invalid move if no card with given id", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromArchiveAction(120);

  // Assert
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(actionStage.name);
});

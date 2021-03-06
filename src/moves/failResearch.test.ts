import { GameS, GameState } from "../gameState";
import { TestCard, TestCardWithCost } from "../test/TestCard";
import { PlayerState } from "../playerState";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { Game } from "boardgame.io";
import { activationStage } from "../stages/activationStage";

function InitialTestScenario(): GameState {
  return new GameS({
    visibleCards: [TestCardWithCost(10, 1, EnergyType.Red, 1), TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [
      TestCardWithCost(12, 1, EnergyType.Red, 3),
      TestCardWithCost(13, 1, EnergyType.Red, 4),
      TestCardWithCost(14, 1, EnergyType.Red, 5),
      TestCardWithCost(15, 1, EnergyType.Red, 5),
      TestCardWithCost(16, 1, EnergyType.Red, 5),
    ],
    players: {
      "0": new PlayerState({
        playerId: "0",
        machines: [TestCard(16, 1)],
        researched: [],
        researchLimit: 3,
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

test("Removes cards from researched", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.failResearchAction();

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const afterPlayerState = afterMove.players["0"];
  expect(afterPlayerState.researched).toHaveLength(0);
});

test("Moves Cards to the proper pile on the table", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.failResearchAction();

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.pileCardsOfLevel(1).slice(-3)).toContainEqual(TestCardWithCost(12, 1, EnergyType.Red, 3));
  expect(afterMove.pileCardsOfLevel(1).slice(-3)).toContainEqual(TestCardWithCost(13, 1, EnergyType.Red, 4));
  expect(afterMove.pileCardsOfLevel(1).slice(-3)).toContainEqual(TestCardWithCost(14, 1, EnergyType.Red, 5));
});

test("Moves to activation stage", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);

  // Act
  client.moves.failResearchAction();

  // Assert
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(activationStage.name);
});

test.skip("cannot be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.researchAction(1);
  client.moves.failResearchAction();
  const preUndoState: GameState = client.store.getState().G;

  // Act
  client.undo();

  // Assert
  const afterUndoState: GameState = client.store.getState().G;
  expect(afterUndoState).toMatchObject(preUndoState);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(activationStage.name);
});

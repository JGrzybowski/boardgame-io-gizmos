import { GameS, GameState } from "../gameState";
import { TestCardWithCost } from "../test/TestCard";
import { PlayerState } from "../playerState";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { Game } from "boardgame.io";
import { paymentStage } from "../stages/paymentStage";
import { activationStage } from "../stages/activationStage";
import { UpgradeEffectCard } from "../cards/upgradeEffectCard";

function InitialTestScenario(): GameState {
  return new GameS({
    visibleCards: [new TestCardWithCost(10, 1, EnergyType.Red, 1), new TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [
      new TestCardWithCost(12, 1, EnergyType.Red, 3),
      new TestCardWithCost(13, 1, EnergyType.Red, 4),
      new TestCardWithCost(14, 1, EnergyType.Red, 5),
    ],
    players: {
      "0": new PlayerState({ playerId: "0", machines: [], energyStorage: new EnergyTypeDictionary(2, 2, 2, 2, 0) }),
      "1": new PlayerState({ playerId: "1", machines: [], energyStorage: new EnergyTypeDictionary(2, 2, 2, 2, 0) }),
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

test("Removes card from build slot", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);

  // Act
  client.moves.confirmBuildAction();

  // Assert
  const afterConfirmBuildState: GameState = client.store.getState().G;
  expect(afterConfirmBuildState.cardToBeBuilt).toBeNull();
});

test("Removes card cost from build cost slot", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);

  // Act
  client.moves.confirmBuildAction();

  // Assert
  const afterConfirmBuildState: GameState = client.store.getState().G;
  expect(afterConfirmBuildState.cardToBeBuiltCost).toBeNull();
});

test("Moves card to player's machines", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);

  // Act
  client.moves.confirmBuildAction();

  // Assert
  const afterConfirmBuildState: GameState = client.store.getState().G;
  const afterConfirmBuildPlayerState: PlayerState = afterConfirmBuildState.players["0"];
  expect(afterConfirmBuildPlayerState.machines).toContainEqual(new TestCardWithCost(10, 1, EnergyType.Red, 1));
});

test("moves to activations stage", () => {
  // Arrange

  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);

  // Act
  client.moves.confirmBuildAction();

  // Assert
  const afterConfirmBuildCtx: GameContext = client.store.getState().ctx;
  expect(afterConfirmBuildCtx.activePlayers?.["0"]).toBe(activationStage.name);
});

test("returns invalid move if build cost is non zero", () => {
  // Arrange

  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(11);
  client.moves.payAction(EnergyType.Red);
  const preConfirmState = client.store.getState().G;
  expect(preConfirmState.cardToBeBuiltCost.R).toBe(1);

  // Act
  client.moves.confirmBuildAction();

  // Assert
  const afterConfirmBuildState: GameState = client.store.getState().G;
  expect(afterConfirmBuildState).toMatchObject(preConfirmState);
  const afterConfirmBuildCtx: GameContext = client.store.getState().ctx;
  expect(afterConfirmBuildCtx.activePlayers?.["0"]).toBe(paymentStage.name);
});

test.skip("can't be undone", () => {
  // Arrange

  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);
  client.moves.confirmBuildAction();
  const afterConfirmBuildState: GameState = client.store.getState().G;

  // Act
  client.undo();

  // Assert
  const afterUndoState: GameState = client.store.getState().G;
  expect(afterUndoState).toMatchObject(afterConfirmBuildState);
  const afterUndoCtx: GameContext = client.store.getState().ctx;
  expect(afterUndoCtx.activePlayers?.["0"]).toBe(activationStage.name);
});

test("Activates single time triggers", () => {
  // Arrange
  const mockCallback = jest.fn((G: GameState) => G);
  const initialGameState = new GameS({
    visibleCards: [
      new UpgradeEffectCard(10, mockCallback, 1, EnergyType.Red, 1, 1),
      new TestCardWithCost(11, 1, EnergyType.Red, 2),
    ],
    pileCards: [
      new TestCardWithCost(12, 1, EnergyType.Red, 3),
      new TestCardWithCost(13, 1, EnergyType.Red, 4),
      new TestCardWithCost(14, 1, EnergyType.Red, 5),
    ],
    players: {
      "0": new PlayerState({ playerId: "0", machines: [], energyStorage: new EnergyTypeDictionary(2, 2, 2, 2, 0) }),
      "1": new PlayerState({ playerId: "1", machines: [], energyStorage: new EnergyTypeDictionary(2, 2, 2, 2, 0) }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);

  // Act
  client.moves.confirmBuildAction();

  // Assert
  expect(mockCallback.mock.calls.length).toBe(1);
});

test.todo("Activation triggers are activated");

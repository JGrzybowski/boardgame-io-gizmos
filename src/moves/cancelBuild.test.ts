import { GameS, GameState } from "../gameState";
import { TestCardWithCost } from "../test/TestCard";
import { PlayerState } from "../playerState";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { actionStage } from "../stages/actionStage";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { Game } from "boardgame.io";
import { researchStage } from "../stages/researchStage";

function InitialTestScenario(): GameState {
  return new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        energyStorage: new EnergyTypeDictionary(2, 2, 2, 2, 0),
        energyStorageCapacity: 5,
        researchLimit: 3,
        researched: [],
        archive: [new TestCardWithCost(21, 2, EnergyType.Red, 2)],
      }),
      "1": new PlayerState({
        playerId: "1",
        energyStorage: new EnergyTypeDictionary(1, 1, 1, 1, 0),
        energyStorageCapacity: 5,
      }),
    },
    cards: [
      new TestCardWithCost(10, 1, EnergyType.Red, 2),
      new TestCardWithCost(11, 1, EnergyType.Red, 2),
      new TestCardWithCost(12, 1, EnergyType.Red, 2),
      new TestCardWithCost(13, 1, EnergyType.Red, 2),
      new TestCardWithCost(14, 1, EnergyType.Red, 2),
    ],
    visibleCardsLimits: [0, 2, 2, 2],
  });
}

function GameWithInitialTestScenario(): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => InitialTestScenario() };
}

function TestClient(game: Game<GameState, GameContext>): any {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("Resets game state and stage to the state before the build (from table)", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  const preBuildState: GameState = client.store.getState().G;

  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  expect(afterCancelBuildState).toMatchObject(preBuildState);
  const afterCancelBuildStateCtx: GameContext = client.store.getState().ctx;
  expect(afterCancelBuildStateCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test("Resets game state and stage to the state before the build (from researched)", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.researchAction(1);
  const prebuildState: GameState = client.store.getState().G;
  client.moves.buildFromResearchedAction(12);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  expect(afterCancelBuildState).toMatchObject(prebuildState);
  const afterCancelBuildStateCtx: GameContext = client.store.getState().ctx;
  expect(afterCancelBuildStateCtx.activePlayers?.["0"]).toBe(researchStage.name);
});

test("Resets game state and stage to the state before the build (from archive)", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  const preBuildState: GameState = client.store.getState().G;

  client.moves.buildFromArchiveAction(21);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  expect(afterCancelBuildState).toMatchObject(preBuildState);
  const afterCancelBuildStateCtx: GameContext = client.store.getState().ctx;
  expect(afterCancelBuildStateCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test("Resets player's energy storage state to the state before the build started", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  expect(afterCancelBuildState.players["0"].energyStorage).toMatchObject(new EnergyTypeDictionary(2, 2, 2, 2, 0));
});

test("Removes card from build slot", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  expect(afterCancelBuildState.cardToBeBuilt).toBeNull();
});

test("Removes card cost from build card cost", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  expect(afterCancelBuildState.cardToBeBuiltCost).toBeNull();
});

test("Returns card to it's space on the table if the build is from table", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  expect(afterCancelBuildState.visibleCards(1)).toContainEqual(new TestCardWithCost(10, 1, EnergyType.Red, 2));
});

test("Returns card to it's space on the researched if the build is from researched", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.researchAction(1);
  client.moves.buildFromResearchedAction(12);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  const afterCancelBuildPlayerState = afterCancelBuildState.players["0"];
  expect(afterCancelBuildPlayerState.researched).toHaveLength(3);
  expect(afterCancelBuildPlayerState.researched).toContainEqual(new TestCardWithCost(12, 1, EnergyType.Red, 2));
  expect(afterCancelBuildPlayerState.researched).toContainEqual(new TestCardWithCost(13, 1, EnergyType.Red, 2));
  expect(afterCancelBuildPlayerState.researched).toContainEqual(new TestCardWithCost(14, 1, EnergyType.Red, 2));
});

test("Returns card to it's space on the archived if the build is from archive", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.buildFromArchiveAction(21);
  client.moves.payAction(EnergyType.Red);
  expect(client.store.getState().G.players["0"].energyStorage.R).toBe(1);

  // Act
  client.moves.cancelBuildAction();

  // Assert
  const afterCancelBuildState: GameState = client.store.getState().G;
  const afterCancelBuildPlayerState = afterCancelBuildState.players["0"];
  expect(afterCancelBuildPlayerState.archive).toHaveLength(1);
  expect(afterCancelBuildPlayerState.archive).toContainEqual(new TestCardWithCost(21, 2, EnergyType.Red, 2));
});

test.skip("can't be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.buildFromCommonAction(10);
  client.moves.payAction(EnergyType.Red);
  client.moves.cancelBuildAction();
  const preUndo: GameState = client.store.getState().G;

  // Act
  client.undo();

  // Assert
  const afterUndo: GameState = client.store.getState().G;
  expect(afterUndo).toMatchObject(preUndo);
  const afterCancelBuildStateCtx: GameContext = client.store.getState().ctx;
  expect(afterCancelBuildStateCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

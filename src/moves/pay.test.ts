import { GameState, GameS } from "../gameState";
import { PlayerState } from "../playerState";
import { GameContext } from "../gameContext";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { Client } from "boardgame.io/client";
import { EnergyType } from "../energyType";
import Gizmos from "../game";
import { Game } from "boardgame.io";
import { TestCardWithCost } from "../test/TestCard";
import { paymentStage } from "../stages/paymentStage";

function InitialTestScenario(): GameState {
  return new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Black, EnergyType.Yellow],
    players: {
      "0": new PlayerState({
        playerId: "0",
        energyStorage: new EnergyTypeDictionary(1, 1, 1, 1, 0),
        energyStorageCapacity: 5,
      }),
      "1": new PlayerState({
        playerId: "1",
        energyStorage: new EnergyTypeDictionary(1, 1, 1, 1, 0),
        energyStorageCapacity: 5,
      }),
    },
    cards: [new TestCardWithCost(10, 1, EnergyType.Red, 2)],
  });
}

function GameWithInitialTestScenario(initialGameState = InitialTestScenario()): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => initialGameState };
}

function TestClient(game: Game<GameState, GameContext>) {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("Removes one energy from player's storage", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);

  //Act
  client.moves.payAction(EnergyType.Red);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  const playerState: PlayerState = afterMove.players["0"];
  expect(playerState.energyStorage.R).toBe(0);
  expect(playerState.energyStorage.U).toBe(1);
  expect(playerState.energyStorage.B).toBe(1);
  expect(playerState.energyStorage.Y).toBe(1);
});

test("Removes one Specific energy from cost", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);

  //Act
  client.moves.payAction(EnergyType.Red);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  const buildCost: EnergyTypeDictionary | null = afterMove.cardToBeBuiltCost;
  expect(buildCost).not.toBeNull();
  expect(buildCost?.R).toBe(1);
  expect(buildCost?.U).toBe(0);
  expect(buildCost?.B).toBe(0);
  expect(buildCost?.Y).toBe(0);
  expect(buildCost?.Any).toBe(0);
});

test("Removes one Any energy from cost if there is no energy of specified type", () => {
  // Arrange
  const initialGameState = new GameS({
    ...InitialTestScenario(),
    cards: [new TestCardWithCost(10, 1, EnergyType.Any, 2)],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);

  //Act
  client.moves.payAction(EnergyType.Red);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  const playerState: PlayerState = afterMove.players["0"];
  expect(playerState.energyStorage.R).toBe(0);
  expect(playerState.energyStorage.U).toBe(1);
  expect(playerState.energyStorage.B).toBe(1);
  expect(playerState.energyStorage.Y).toBe(1);

  const buildCost: EnergyTypeDictionary | null = afterMove.cardToBeBuiltCost;
  expect(buildCost).not.toBeNull();
  expect(buildCost?.R).toBe(0);
  expect(buildCost?.U).toBe(0);
  expect(buildCost?.B).toBe(0);
  expect(buildCost?.Y).toBe(0);
  expect(buildCost?.Any).toBe(1);
});

test("returns invalid move if player does not have energy of the specified type", () => {
  // Arrange
  const initialGameState = new GameS({
    ...InitialTestScenario(),
    players: {
      "0": new PlayerState({
        playerId: "0",
        energyStorage: new EnergyTypeDictionary(0, 1, 1, 1, 0),
        energyStorageCapacity: 5,
      }),
      "1": new PlayerState({
        playerId: "1",
        energyStorage: new EnergyTypeDictionary(1, 1, 1, 1, 0),
        energyStorageCapacity: 5,
      }),
    },
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  const preMove: GameState = client.store.getState().G;

  //Act
  client.moves.payAction(EnergyType.Red);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(paymentStage.name);
});

test("returns invalid move if the specified energy cannot pay for any part of the cost", () => {
  // Arrange
  const initialGameState = new GameS({
    ...InitialTestScenario(),
    cards: [new TestCardWithCost(10, 1, EnergyType.Yellow, 2)],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  const preMove: GameState = client.store.getState().G;

  //Act
  client.moves.payAction(EnergyType.Red);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(paymentStage.name);
});

test("returns invalid move if the cost is zero", () => {
  // Arrange
  const initialGameState = new GameS({
    ...InitialTestScenario(),
    cards: [new TestCardWithCost(10, 1, EnergyType.Red, 0)],
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  const preMove: GameState = client.store.getState().G;

  //Act
  client.moves.payAction(EnergyType.Red);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(paymentStage.name);
});

test("Does not change the previous state", () => {
  // Arrange
  const initialGameState = InitialTestScenario();
  const originalGameState = InitialTestScenario();

  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);

  //Act
  client.moves.payAction(EnergyType.Red);

  //Assert
  expect(initialGameState).toMatchObject(originalGameState);
});

test.skip("can be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(10);
  const preMove: GameState = client.store.getState().G;
  client.moves.payAction(EnergyType.Red);

  //Act
  client.undo();

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(preMove);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(paymentStage.name);
});

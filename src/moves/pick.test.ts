import { GameState, GameS } from "../gameState";
import { PlayerState } from "../playerState";
import { GameContext } from "../gameContext";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { Client } from "boardgame.io/client";
import { EnergyType } from "../basicGameElements";
import Gizmos from "../game";
import { Game } from "boardgame.io";
import { activationStage } from "../stages/activationStage";
import { actionStage } from "../stages/actionStage";

function InitialTestScenario(): GameState {
  return new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Black, EnergyType.Yellow],
    dispenser: new EnergyTypeDictionary(1, 0, 0, 0, 0),
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
  });
}

function GameWithInitialTestScenario(initialGameState = InitialTestScenario()): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => initialGameState };
}

function TestClient(game: Game<GameState, GameContext>) {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("Adds energy to player's storage", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  //Act
  client.moves.pickAction(3);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  const playerState: PlayerState = afterMove.players["0"];
  expect(playerState.energyStorage.R).toBe(1);
  expect(playerState.energyStorage.U).toBe(1);
  expect(playerState.energyStorage.B).toBe(1);
  expect(playerState.energyStorage.Y).toBe(2);
});

test("Removes energy of given index from the EnergyRow and adds new energy at the end of it", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  //Act
  client.moves.pickAction(3);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.energyRow).toHaveLength(4);
  expect(afterMove.energyRow[0]).toBe(EnergyType.Red);
  expect(afterMove.energyRow[1]).toBe(EnergyType.Blue);
  expect(afterMove.energyRow[2]).toBe(EnergyType.Black);
  expect(afterMove.energyRow[3]).toBe(EnergyType.Red);
});

test.skip("can be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.pickAction(3);

  //Act
  client.undo();

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(InitialTestScenario());
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test("Returns invalid move if index is out of range", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  //Act
  client.moves.pickAction(5);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(InitialTestScenario());
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test("Returns invalid move if player has no space in the energy storage", () => {
  // Arrange
  const initialGameState = new GameS({
    energyRow: [EnergyType.Red, EnergyType.Blue, EnergyType.Black, EnergyType.Yellow],
    dispenser: new EnergyTypeDictionary(1, 0, 0, 0, 0),
    players: {
      "0": new PlayerState({
        playerId: "0",
        energyStorage: new EnergyTypeDictionary(1, 1, 1, 1, 0),
        energyStorageCapacity: 4,
      }),
      "1": new PlayerState({
        playerId: "1",
        energyStorage: new EnergyTypeDictionary(1, 1, 1, 1, 0),
        energyStorageCapacity: 4,
      }),
    },
  });
  const GameCustomScenario = GameWithInitialTestScenario(initialGameState);
  const client = TestClient(GameCustomScenario);

  //Act
  client.moves.pickAction(2);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove).toMatchObject(initialGameState);
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(actionStage.name);
});

test("Moves to activation stage", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  //Act
  client.moves.pickAction(3);

  //Assert
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx.activePlayers?.["0"]).toBe(activationStage.name);
});

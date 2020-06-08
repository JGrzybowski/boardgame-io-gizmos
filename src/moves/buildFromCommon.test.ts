import { GameS, GameState } from "../gameState";
import { TestCard, TestCardWithCost } from "../test/TestCard";
import { PlayerState } from "../playerState";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { actionStage } from "../stages/actionStage";
import { GameContext } from "../gameContext";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { Game } from "boardgame.io";

function InitialTestScenario(): GameState {
  return new GameS({
    visibleCards: [new TestCardWithCost(10, 1, EnergyType.Red, 1), new TestCardWithCost(11, 1, EnergyType.Red, 2)],
    pileCards: [
      new TestCardWithCost(12, 1, EnergyType.Red, 3),
      new TestCardWithCost(13, 1, EnergyType.Red, 4),
      new TestCardWithCost(14, 1, EnergyType.Red, 5),
    ],
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(16, 1)] }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)] }),
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

test("selected card is moved into the build slot", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromCommonAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cardToBeBuilt).toMatchObject(new TestCardWithCost(11, 1, EnergyType.Red, 2));
});

test("does not cause another card to be shown", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromCommonAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.visibleCardsOfLevel(1)).toHaveLength(1);
  expect(afterMove.visibleCardsOfLevel(1)).toContainEqual(new TestCardWithCost(11, 1, EnergyType.Red, 2));
});

test("card cost is set up", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromCommonAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cardToBeBuiltCost).toMatchObject(EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Red, 2));
});

test.skip("can be undone", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);
  client.moves.buildFromCommonAction(11);

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
  client.moves.buildFromCommonAction(101);

  // Assert
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(actionStage.name);
});

test("returns invalid move if slot is occupied", () => {
  // Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext): GameState => {
      const G = new GameS({
        visibleCards: [new TestCard(10, 1), new TestCard(11, 1)],
        players: {
          "0": new PlayerState({ playerId: "0", machines: [new TestCard(16, 1)], researchLimit: 3 }),
          "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)], researchLimit: 3 }),
        },
        visibleCardsLimits: [0, 2, 2, 2],
        cardToBeBuilt: new TestCardWithCost(13, 1, EnergyType.Red, 4),
        cardToBeBuiltCost: EnergyTypeDictionary.fromTypeAndAmount(EnergyType.Red, 4),
      });
      ctx.events?.setStage?.(actionStage.name);
      return G;
    },
  };
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromCommonAction(11);

  // Assert
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(actionStage.name);
});

test("Sets up the Game state to return to", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  // Act
  client.moves.buildFromCommonAction(11);

  // Assert
  const afterMove: GameState = client.store.getState().G;
  const expectedState = InitialTestScenario();
  expect(afterMove.gameStateBeforeBuild).toMatchObject(expectedState);
});

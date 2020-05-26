import { GameS, GameState } from "../gameState";
import { TestCard } from "../test/TestCard";
import { PlayerState } from "../playerState";
import Gizmos from "../game";
import { Client } from "boardgame.io/client";
import { actionStage } from "../stages/actionStage";
import { GameContext } from "../gameContext";
import { Game } from "boardgame.io";

function InitialTestScenario(): GameState {
  return new GameS({
    cards: [new TestCard(10, 1), new TestCard(11, 1), new TestCard(12, 1), new TestCard(13, 1), new TestCard(14, 1)],
    players: {
      "0": new PlayerState({ playerId: "0", machines: [new TestCard(16, 1)], researchLimit: 3 }),
      "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)], researchLimit: 3 }),
    },
    visibleCardsLimits: [0, 2, 2, 2],
  });
}

function GameWithInitialTestScenario(): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => InitialTestScenario() };
}

function TestClient(game: Game<GameState, GameContext>) {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("Moves cards from pile to the active player researched collection", () => {
  //Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  //Act
  client.moves.researchAction(1);

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cards).toHaveLength(2);

  const afterPlayerState = afterMove.players["0"];
  expect(afterPlayerState.researchLimit).toBe(3);
  expect(afterPlayerState.researched).toHaveLength(afterPlayerState.researchLimit);
  expect(afterPlayerState.researched.map((c) => c.cardId)).toContain(12);
  expect(afterPlayerState.researched.map((c) => c.cardId)).toContain(13);
  expect(afterPlayerState.researched.map((c) => c.cardId)).toContain(14);
});

test("Cannot be undone", () => {
  //Arrange
  const GameCustomScenario = GameWithInitialTestScenario();
  const client = TestClient(GameCustomScenario);

  client.moves.researchAction(1);

  //Act
  client.undo();

  //Assert
  const afterMove: GameState = client.store.getState().G;
  expect(afterMove.cards).toHaveLength(2);

  const afterPlayerState = afterMove.players["0"];
  expect(afterPlayerState.researchLimit).toBe(3);
  expect(afterPlayerState.researched).toHaveLength(afterPlayerState.researchLimit);
  expect(afterPlayerState.researched.map((c) => c.cardId)).toContain(12);
  expect(afterPlayerState.researched.map((c) => c.cardId)).toContain(13);
  expect(afterPlayerState.researched.map((c) => c.cardId)).toContain(14);
});

test("No cards in the pile returns invalid move", () => {
  //Arrange
  const GameCustomScenario = {
    ...Gizmos,
    setup: (ctx: GameContext): GameState => {
      const G = new GameS({
        cards: [new TestCard(10, 1), new TestCard(11, 1)],
        players: {
          "0": new PlayerState({ playerId: "0", machines: [new TestCard(16, 1)], researchLimit: 3 }),
          "1": new PlayerState({ playerId: "1", machines: [new TestCard(21, 2)], researchLimit: 3 }),
        },
        visibleCardsLimits: [0, 2, 2, 2],
      });
      ctx.events?.setStage?.(actionStage.name);
      return G;
    },
  };
  const client = TestClient(GameCustomScenario);

  //Act
  client.moves.researchAction(1);

  //Assert
  const afterMoveCtx: GameContext = client.store.getState().ctx;
  expect(afterMoveCtx?.activePlayers?.["0"]).toBe(actionStage.name);
});

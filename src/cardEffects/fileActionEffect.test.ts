import { GameState, GameS } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerState } from "../playerState";
import { Game } from "boardgame.io";
import Gizmos from "../game";
import { FileActionEffect } from "./fileActionEffect";
import { Client } from "boardgame.io/client";
import { CardInfo } from "../cards/cardInfo";
import { TestCard } from "../test/TestCard";

function InitialTestScenario(archive: ReadonlyArray<CardInfo>): GameState {
  return new GameS({
    players: {
      "0": new PlayerState({
        playerId: "0",
        archive: archive,
        archiveLimit: 2,
      }),
    },
  });
}

function GameWithInitialTestScenario(initialTestScenario: GameState): Game<GameState, GameContext> {
  return { ...Gizmos, setup: (): GameState => initialTestScenario };
}

function TestClient(game: Game<GameState, GameContext>): any {
  return Client({ game, numPlayers: 2, playerID: "0" });
}

test("Cannot be resolved only if player has no space in the archive", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario(InitialTestScenario([TestCard(10, 1), TestCard(11, 1)]));
  const client = TestClient(GameCustomScenario);

  const fileEffect = new FileActionEffect();
  const gameState: GameState = client.store.getState().G;

  const result = fileEffect.canBeResolved(gameState, gameState.players["0"]);
  expect(result).toBe(false);
});

test("Can be resolved only if player has space in archive", () => {
  // Arrange
  const GameCustomScenario = GameWithInitialTestScenario(InitialTestScenario([]));
  const client = TestClient(GameCustomScenario);

  const fileEffect = new FileActionEffect();
  const gameState: GameState = client.store.getState().G;

  const result = fileEffect.canBeResolved(gameState, gameState.players["0"]);
  expect(result).toBe(true);
});

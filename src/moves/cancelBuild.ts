import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerMove } from "./playerMove";
import { INVALID_MOVE } from "boardgame.io/core";

function cancelBuildMove(G: GameState, ctx: GameContext): GameState | string {
  if (!G.previousStageName || !G.playerStateBeforeBuild || !G.gameStateBeforeBuild) return INVALID_MOVE;

  // move revealed cards to the bottom of deck from revealed cards
  const oldPlayerState = G.playerStateBeforeBuild;
  const oldGameState = G.gameStateBeforeBuild;

  ctx.player?.set(oldPlayerState);
  ctx.events?.setStage?.(G.previousStageName);
  return oldGameState;
}

export const cancelBuildAction: PlayerMove = {
  move: cancelBuildMove,
  client: false,
  undoable: false,
};

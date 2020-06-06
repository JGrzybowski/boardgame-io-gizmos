import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerState } from "../playerState";
import { INVALID_MOVE } from "boardgame.io/core";
import { activationStage } from "../stages/activationStage";
import { PlayerMove } from "./playerMove";
import { From } from "../pickers/From";
import { To } from "../putters/To";

function failResearchMove(G: GameState, ctx: GameContext): GameState | string {
  if (!ctx.playerID) return INVALID_MOVE;
  const playerId = ctx.playerID;
  const playerState: PlayerState = G.players[playerId];
  if (!playerState) return INVALID_MOVE;

  // move revealed cards to the bottom of deck from revealed cards
  const newGameState = G.moveCard(From.PlayerResearched(playerId), To.BottomOfPile());

  ctx.events?.setStage?.(activationStage.name);
  return newGameState;
}

export const failResearchAction: PlayerMove = {
  move: failResearchMove,
  client: false,
  undoable: false,
};

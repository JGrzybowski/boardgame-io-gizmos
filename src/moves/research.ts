import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { PlayerState } from "../playerState";
import { INVALID_MOVE } from "boardgame.io/core";
import { CardLevel } from "../cards/cardInfo";
import { PlayerMove } from "./playerMove";
import { researchStage } from "../stages/researchStage";
import { From } from "../From";
import { To } from "../To";

function researchMove(G: GameState, ctx: GameContext, cardLevel: CardLevel): GameState | string {
  const playerState: PlayerState = G.players[ctx.currentPlayer]; // ctx.player?.get();
  if (!playerState.canResearch()) return INVALID_MOVE;
  if (cardLevel === 0) return INVALID_MOVE;
  if (G.cards.filter((c) => c.level === cardLevel).length <= G.visibleCardsLimits[cardLevel]) return INVALID_MOVE;

  const newGameState = G.moveCard(
    From.TopOfPile(cardLevel, playerState.researchLimit),
    To.PlayerResearched(ctx.currentPlayer)
  );

  ctx.events?.setStage?.(researchStage.name);
  return newGameState;
}

export const researchAction: PlayerMove = {
  move: researchMove,
  undoable: false,
  client: false,
};

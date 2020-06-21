import { GameState } from "../gameState";
import { PlayerState } from "../playerState";
import { GameContext } from "../gameContext";
import { INVALID_MOVE } from "boardgame.io/core";

export function BlockResearchEffect(G: GameState, ctx: GameContext): GameState | string {
  if (G.cardToBeBuilt) return INVALID_MOVE;
  if (!ctx.playerID) return INVALID_MOVE;
  const playerId = ctx.playerID;
  const playerState: PlayerState = G.players[playerId];

  const newPlayerState = new PlayerState({ ...playerState, isResearchBlocked: true });
  return G.withUpdatedPlayer(playerId, newPlayerState);
}

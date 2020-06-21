import { CardEffect } from "../cards/cardEffect";
import { GameState } from "../gameState";
import { PlayerState } from "../playerState";
import { GameContext } from "../gameContext";
import { INVALID_MOVE } from "boardgame.io/core";
import { CardEffectFunction } from "../cards/cardInfo";

export function ReceiveVictoryPointesEffect(points: number): CardEffectFunction {
  return (G: GameState, ctx: GameContext): string | GameState => {
    if (G.cardToBeBuilt) return INVALID_MOVE;
    if (!ctx.playerID) return INVALID_MOVE;
    const playerId = ctx.playerID;
    const playerState: PlayerState = G.players[playerId];

    const victoryPoints = playerState.victoryPoints + points;
    const newPlayerState = new PlayerState({ ...playerState, victoryPoints });
    return G.withUpdatedPlayer(playerId, newPlayerState);
  };
}

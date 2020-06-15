import { CardInfo, CardEffectFunction, CardLevel } from "./cardInfo";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { GameContext } from "../gameContext";
import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";

export function UpgradeEffectCard(
  cardId: number,
  oneTimeEffect: CardEffectFunction,
  victoryPoints: number,
  color: EnergyType,
  cost: number,
  level: CardLevel
): CardInfo {
  return {
    cardId,
    type: TriggerType.Upgrade,
    oneTimeEffect,
    victoryPoints,
    color,
    cost,
    level,
  };
}

export function UpgradeLimitsEffectFunction(
  storage = 0,
  archive = 0,
  research = 0
): (G: GameState, ctx: GameContext) => GameState | string {
  return (G: GameState, ctx: GameContext): GameState | string => {
    const playerId = ctx.playerID;
    if (!playerId) return INVALID_MOVE;
    const playerState = G.players[playerId];
    if (!playerState) return INVALID_MOVE;

    const newGameState = G.withUpdatedPlayer(playerId, playerState.withLimitsChangedBy(storage, archive, research));
    return newGameState;
  };
}

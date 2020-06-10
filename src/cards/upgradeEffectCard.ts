import { CardInfo, CardEffectFunction, CardLevel } from "./cardInfo";
import { EnergyType } from "../energyType";
import { TriggerType } from "./triggerType";
import { GameContext } from "../gameContext";
import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";

export class UpgradeEffectCard extends CardInfo<any> {
  constructor(
    cardId: number,
    oneTimeEffect: CardEffectFunction | null,
    victoryPoints: number,
    color: EnergyType,
    cost: number,
    level: CardLevel
  ) {
    super(cardId, TriggerType.Upgrade, oneTimeEffect, null, victoryPoints, color, cost, level);
  }
}

export function UpgradeEffectFunction(
  G: GameState,
  Ctx: GameContext,
  storage = 0,
  archive = 0,
  research = 0
): GameState | string {
  const playerId = Ctx.playerID;
  if (!playerId) return INVALID_MOVE;
  const playerState = G.players[playerId];
  if (!playerState) return INVALID_MOVE;

  const newGameState = G.withUpdatedPlayer(playerId, playerState.withLimitsChangedBy(storage, archive, research));
  return newGameState;
}

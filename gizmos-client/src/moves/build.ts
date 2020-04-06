import { EnergyType } from "../basicGameElements";
import { GameState } from "../gameState";
import { Card } from "../cards/card";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameContext } from "../gameContext";
import {CardCost} from "../cards/cardCost";

function declaredEnergyCanPay(selectedCard: Card, paidEnergy: ReadonlyArray<EnergyType>): boolean {
  // declared energy can pay
  const payment = CardCost.fromArray(paidEnergy);
  return payment[selectedCard.color] === amountToPay;
}

function buildFromCommon(G: GameState, ctx: GameContext, cardId: number, paidEnergy: ReadonlyArray<EnergyType>): GameState | string {
  const selectedCard = G.findCardOnTheTable(cardId);
  const playerState = ctx.player?.get();

  if (selectedCard === null) return INVALID_MOVE;
  if (!playerState.hasDeclaredEnergy(paidEnergy)) return INVALID_MOVE;
  if (!declaredEnergyCanPay(selectedCard, paidEnergy)) return INVALID_MOVE;

  // add card to player's machines
  const machines = playerState.machinesWith(selectedCard);
  const energyStorage = playerState.energyStorageWithout(paidEnergy);

  ctx.player?.set({ ...playerState, machines, energyStorage });

  const cards = G.cardsWithout(cardId);
  return { ...G, cards };
}

function buildFromArchive(
  G: GameState,
  ctx: GameContext,
  cardId: number,
  paidEnergy: ReadonlyArray<EnergyType>
): GameState | string {
  const playerState = ctx.player?.get();
  const selectedCard = playerState.findCardInTheArchive(cardId);

  if (selectedCard === null) return INVALID_MOVE;
  if (!playerState.hasDeclaredEnergy(paidEnergy)) return INVALID_MOVE;
  if (!declaredEnergyCanPay(selectedCard, paidEnergy)) return INVALID_MOVE;

  // add card to player's machines
  const energyStorage = playerState.energyStorageWithout(paidEnergy);
  const machines = playerState.machinesWith(selectedCard);
  const archive = playerState.archiveWithout(selectedCard.cardId);

  // TODO REWRITE USING CLASS & INTERFACES
  ctx.player?.set({ ...playerState, machines, archive, energyStorage });
  return G;
}

export const buildFromCommonAction = {
  move: buildFromCommon,
  undoable: false
};

export const buildFromArchiveAction = {
  move: buildFromArchive,
  undoable: false
};
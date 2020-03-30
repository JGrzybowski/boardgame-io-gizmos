import { EnergyType } from "../basicGameElements";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { Card, CostColor } from "../cards/card";
import { INVALID_MOVE } from "boardgame.io/core";

export const buildFromCommonAction = {
  move: buildFromCommon,
  undoable: false
};

export const buildFromArchiveAction = {
  move: buildFromArchive,
  undoable: false
};

function buildFromCommon(G: GameState, ctx: GameContext, cardId: number, paidEnergy: EnergyType[]): GameState | string {
  const selectedCard = G.findCardOnTheTable(cardId);
  const playerState = ctx.player.get();

  if (selectedCard === null) return INVALID_MOVE;
  if (!playerState.hasDeclaredEnergy(paidEnergy)) return INVALID_MOVE;
  if (!declaredEnergyCanPay(selectedCard, paidEnergy)) return INVALID_MOVE;

  // add card to player's machines
  const machines = playerState.machinesWith(selectedCard);
  const energyStorage = playerState.energyStorageWithout(paidEnergy);

  // TODO REWRITE USING CLASS & INTERFACES
  ctx.player.set({ ...playerState, machines, energyStorage });

  // TODO REWRITE USING CLASS & INTERFACES
  const cards = G.cardsWithout(cardId);
  return { ...G, cards };
}

function buildFromArchive(
  G: GameState,
  ctx: GameContext,
  cardId: number,
  paidEnergy: ReadonlyArray<EnergyType>
): GameState | string {
  const playerState = ctx.player.get();
  const selectedCard = playerState.findCardInTheArchive(cardId);

  if (selectedCard === null) return INVALID_MOVE;
  if (!playerState.hasDeclaredEnergy(paidEnergy)) return INVALID_MOVE;
  if (!declaredEnergyCanPay(selectedCard, paidEnergy)) return INVALID_MOVE;

  // add card to player's machines
  const energyStorage = playerState.energyStorageWithout(paidEnergy);
  const machines = playerState.machinesWith(selectedCard);
  const archive = playerState.archiveWithout(selectedCard.cardId);

  // TODO REWRITE USING CLASS & INTERFACES
  ctx.player.set({ ...playerState, machines, archive, energyStorage });
  return G;
}

function declaredEnergyCanPay(selectedCard: Card, paidEnergy: ReadonlyArray<EnergyType>): boolean {
  // declared energy can pay
  const payment = paidEnergy.reduce(countOcurrences, zeroCounter());
  const costColor = selectedCard.color;
  const amountToPay = selectedCard.cost;
  return payment[costColor] === amountToPay;
}

function countOcurrences(counters: any, energy: EnergyType) {
  counters[energy] += 1;
  counters[CostColor.Any] += 1;
  return counters;
}

function zeroCounter() {
  const counter: any = {};
  counter[CostColor.Any] = 0;
  counter[CostColor.Black] = 0;
  counter[CostColor.Blue] = 0;
  counter[CostColor.Red] = 0;
  counter[CostColor.Yellow] = 0;
  return counter;
}

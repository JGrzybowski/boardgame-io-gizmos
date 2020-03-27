import { EnergyType } from "../basicGameElements";
import { GameState } from "../gameState";
import { GameContext } from "../gameContext";
import { Card, CostColor } from "../cards/card";

export function buildFromCommon(
  G: GameState,
  ctx: GameContext,
  cardId: number,
  paidEnergy: Array<EnergyType>
): GameState | void {
  const selectedCard = G.findCardOnTheTable(cardId);
  const playerState = ctx.player.get();

  if (selectedCard === null) return;
  if (!playerState.hasDeclaredEnergy(paidEnergy)) return;
  if (!declaredEnergyCanPay(selectedCard, paidEnergy)) return;

  // add card to player's machines
  let machines = playerState.machinesWith(selectedCard);
  let energyStorage = playerState.energyStorageWithout(paidEnergy);

  //TODO REWRITE USING CLASS & INTERFACES
  ctx.player.set({ ...playerState, machines, energyStorage });

  //TODO REWRITE USING CLASS & INTERFACES
  let cards = G.cardsWithout(cardId);
  return { ...G, cards };
}

export function buildFromArchive(
  G: GameState,
  ctx: GameContext,
  cardId: number,
  paidEnergy: Array<EnergyType>
): GameState | void {
  const playerState = ctx.player.get();
  const selectedCard = playerState.findCardInTheArchive(cardId);

  if (selectedCard === null) return;
  if (!playerState.hasDeclaredEnergy(paidEnergy)) return;
  if (!declaredEnergyCanPay(selectedCard, paidEnergy)) return;

  // add card to player's machines
  let energyStorage = playerState.energyStorageWithout(paidEnergy);
  let machines = playerState.machinesWith(selectedCard);
  let archive = playerState.archiveWithout(selectedCard.cardId);

  //TODO REWRITE USING CLASS & INTERFACES
  ctx.player.set({ ...playerState, machines, archive, energyStorage });
  return { ...G };
}

function declaredEnergyCanPay(
  selectedCard: Card,
  paidEnergy: Array<EnergyType>
) {
  // declared energy can pay
  let payment = paidEnergy.reduce(countOcurrences, zeroCounter());
  let costColor = selectedCard.color;
  let amountToPay = selectedCard.cost;
  return payment[costColor] === amountToPay;
}

function countOcurrences(counters: any, energy: EnergyType) {
  counters[energy] += 1;
  counters[CostColor.Any] += 1;
  return counters;
}

function zeroCounter() {
  let counter: any = {};
  counter[CostColor.Any] = 0;
  counter[CostColor.Black] = 0;
  counter[CostColor.Blue] = 0;
  counter[CostColor.Red] = 0;
  counter[CostColor.Yellow] = 0;
  return counter;
}

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
  const selectedCard = G.cards.find(c => c.cardId === cardId);
  if (typeof selectedCard === "undefined") return;

  const playerState = ctx.player.get();
  let energyStorage = [...playerState.energyStorage];

  if (
    PlayerCanPayForSelectedCardWithEnergy(
      selectedCard,
      energyStorage,
      paidEnergy
    )
  )
    return;

  // add card to player's machines
  let machines = [...playerState.archive];
  machines.push(selectedCard);
  ctx.player.set({ ...playerState, machines, energyStorage });

  // remove card from common area
  let cards = [...G.cards];
  cards = cards.filter((c: Card) => c.cardId != cardId);
  return { ...G, cards };
}

export function buildFromArchive(
  G: GameState,
  ctx: GameContext,
  cardId: number,
  paidEnergy: Array<EnergyType>
): GameState | void {
  const playerState = ctx.player.get();
  let energyStorage = [...playerState.energyStorage];

  const selectedCard = [...playerState.archive].find(
    (c: Card) => c.cardId == cardId
  );
  if (typeof selectedCard === "undefined") return;

  if (
    PlayerCanPayForSelectedCardWithEnergy(
      selectedCard,
      energyStorage,
      paidEnergy
    )
  )
    return;

  // add card to player's machines
  let removeOneEnergy = function(
    storage: Array<EnergyType>,
    energy: EnergyType
  ): Array<EnergyType> {
    let i = storage.indexOf(energy);
    return storage.slice(0, i).concat(storage.slice(i + 1, storage.length));
  };
  energyStorage = energyStorage.reduce(removeOneEnergy, energyStorage);

  let machines = [...playerState.machines];
  machines.push(selectedCard);

  let archive = [...playerState.archive];
  archive = archive.filter(c => c.cardId != cardId);

  ctx.player.set({ ...playerState, machines, archive, energyStorage });

  return { ...G };
}

function PlayerCanPayForSelectedCardWithEnergy(
  selectedCard: Card,
  energyStorage: Array<EnergyType>,
  paidEnergy: Array<EnergyType>
) {
  // player has declared energy
  let playerEnergy = energyStorage.reduce(countOcurrences, zeroCounter());
  let payment = paidEnergy.reduce(countOcurrences, zeroCounter());

  let playerHasDeclaredEnergy = true;
  for (let energy in payment) {
    playerHasDeclaredEnergy =
      playerHasDeclaredEnergy && payment[energy] <= playerEnergy[energy];
  }

  if (!playerHasDeclaredEnergy) return false;

  // declared energy can pay
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

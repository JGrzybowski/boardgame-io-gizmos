import { CardInfo } from "./cards/card";
import { EnergyType, initialDispenser } from "./basicGameElements";
import { CardsList } from "./cards/cardsList";
import { CardCost } from "./cards/cardCost";
import { PlayerState } from "./playerState";
import { Ctx } from "boardgame.io";
import { GameContext } from "./gameContext";

export interface GameState {
  readonly dispenser: ReadonlyArray<EnergyType>;
  readonly cards: ReadonlyArray<CardInfo>;
  readonly visibleEnergyBallsLimit: number;
  readonly cardToBeBuilt: CardInfo | null;
  readonly cardToBeBuiltCost: CardCost | null;
  readonly visibleCardsLimits: ReadonlyArray<number>;

  readonly previousStageName: string | null;
  readonly playerStateBeforeBuild: PlayerState | null;
  readonly gameStateBeforeBuild: GameState | null;

  findCardOnTheTable(cardId: number): CardInfo | null;
  cardsWithout(cardId: number): ReadonlyArray<CardInfo>;
  energyWithIndexCanBeTakenFromEnergyRow(index: number): boolean;
  dispenserWithoutEnergy(energy: EnergyType): ReadonlyArray<EnergyType>;
  dispenserWithout(index: number): [ReadonlyArray<EnergyType>, EnergyType];
  withCardRemovedFromTable(cardId: number): GameState;
  withDispenserWithout(index: number): [GameState, EnergyType];
  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: CardCost): GameState;
  withCardsPutOnBottom(cards: ReadonlyArray<CardInfo>): GameState;
  revealedCardsFromPile(researchLimit: number, cardLevel: 1 | 2 | 3): [GameState, ReadonlyArray<CardInfo>];
  withCardToBeBuiltCleared(): GameState;

  withEnergyRemovedFromCost(paidFor: EnergyType): GameState;

  withPlayerAndGameStateSaved(ctx: Ctx): GameState;

  withEnergyAddedToCost(changeTo: EnergyType): GameState;
}

export const InitialGameState: GameState = {
  dispenser: initialDispenser,
  cards: CardsList,
  visibleEnergyBallsLimit: 6,
  visibleCardsLimits: [0, 4, 3, 2],

  cardToBeBuilt: null,
  cardToBeBuiltCost: null,

  previousStageName: null,
  playerStateBeforeBuild: null,
  gameStateBeforeBuild: null,

  findCardOnTheTable(cardId: number): CardInfo | null {
    const card = this.cards.find((c) => c.cardId === cardId);
    return !card ? null : card;
  },

  cardsWithout(cardId: number): ReadonlyArray<CardInfo> {
    return this.cards.filter((c: CardInfo) => c.cardId !== cardId);
  },

  energyWithIndexCanBeTakenFromEnergyRow(index: number): boolean {
    return index >= 0 && index < this.visibleEnergyBallsLimit;
  },

  dispenserWithoutEnergy(energy: EnergyType): ReadonlyArray<EnergyType> {
    const i = this.dispenser.indexOf(energy);
    return this.dispenserWithout(i)[0];
  },

  dispenserWithout(index: number): [ReadonlyArray<EnergyType>, EnergyType] {
    const energy = this.dispenser[index];
    const dispenser = this.dispenser.filter((e, idx) => idx !== index);
    return [dispenser, energy];
  },

  withCardRemovedFromTable(cardId: number): GameState {
    const cards = this.cardsWithout(cardId);
    return { ...this, cards };
  },

  withDispenserWithout(index: number): [GameState, EnergyType] {
    const [dispenser, energy] = this.dispenserWithout(index);
    return [{ ...this, dispenser }, energy];
  },

  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: CardCost): GameState {
    return { ...this, cardToBeBuilt, cardToBeBuiltCost };
  },

  withCardsPutOnBottom(returnedCards: ReadonlyArray<CardInfo>): GameState {
    const cards = [...this.cards, ...returnedCards];
    return { ...this, cards };
  },

  revealedCardsFromPile(researchLimit: number, cardLevel: 1 | 2 | 3): [GameState, ReadonlyArray<CardInfo>] {
    const revealedCards: ReadonlyArray<CardInfo> = this.cards
      .filter((c) => c.level === cardLevel)
      .slice(this.visibleCardsLimits[cardLevel], this.visibleCardsLimits[cardLevel] + researchLimit);
    const cards: ReadonlyArray<CardInfo> = this.cards.filter((c) => revealedCards.find((r) => c.cardId === r.cardId));
    return [{ ...this, cards }, revealedCards];
  },

  withCardToBeBuiltCleared(): GameState {
    return { ...this, cardToBeBuilt: null, cardToBeBuiltCost: null };
  },

  withEnergyRemovedFromCost(paidFor: EnergyType): GameState {
    if (!this.cardToBeBuiltCost) throw new Error("There is no card to pay for.");

    const reducedAmount = this.cardToBeBuiltCost?.amountToPayWithEnergyType(paidFor) - 1;
    const cardToBeBuiltCost = this.cardToBeBuiltCost?.withAmountToPayWithEnergyTypeSetTo(paidFor, reducedAmount);

    return { ...this, cardToBeBuiltCost };
  },

  withEnergyAddedToCost(paidFor: EnergyType): GameState {
    if (!this.cardToBeBuiltCost) throw new Error("There is no card to pay for.");

    const increasedAmount = this.cardToBeBuiltCost?.amountToPayWithEnergyType(paidFor) + 1;
    const cardToBeBuiltCost = this.cardToBeBuiltCost?.withAmountToPayWithEnergyTypeSetTo(paidFor, increasedAmount);

    return { ...this, cardToBeBuiltCost };
  },

  withPlayerAndGameStateSaved(ctx: GameContext): GameState {
    return {
      ...this,
      gameStateBeforeBuild: this,
      playerStateBeforeBuild: ctx.player?.get(),
      previousStageName: ctx.activePlayers?.[ctx.currentPlayer] ?? null,
    };
  },
};

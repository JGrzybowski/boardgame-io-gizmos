import { Card } from "./cards/card";
import { EnergyType, initialDispenser } from "./basicGameElements";
import { CardsList } from "./cards/cardsList";

export interface GameState {
  readonly dispenser: ReadonlyArray<EnergyType>;
  readonly cards: ReadonlyArray<Card>;
  findCardOnTheTable(cardId: number): Card | null;
  cardsWithout(cardId: number): ReadonlyArray<Card>;
  dispenserWithout(energy: EnergyType): ReadonlyArray<EnergyType>;
  dispenserWithoutInternal(index: number): [EnergyType, ReadonlyArray<EnergyType>];
}

export const InitialGameState: GameState = {
  dispenser: initialDispenser,
  cards: CardsList,

  findCardOnTheTable(cardId: number): Card | null {
    const card = this.cards.find(c => c.cardId === cardId);
    return !card ? null : card;
  },

  cardsWithout(cardId: number): ReadonlyArray<Card> {
    const cards = this.cards.filter((c: Card) => c.cardId !== cardId);
    return cards;
  },

  dispenserWithout(energy: EnergyType): ReadonlyArray<EnergyType> {
    const i = this.dispenser.indexOf(energy);
    return this.dispenserWithoutInternal(i)[1];
  },

  dispenserWithoutInternal(index: number): [EnergyType, ReadonlyArray<EnergyType>] {
    const energy = this.dispenser[index];
    const dispenser = this.dispenser.filter((e, idx) => idx !== index);
    return [energy, dispenser];
  }
};

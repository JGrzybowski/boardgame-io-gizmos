import { Card } from "./cards/card";
import { EnergyType, initialDispenser } from "./basicGameElements";
import { CardsList } from "./cards/cardsList";

export interface GameState {
  readonly dispenser: Array<EnergyType>;
  readonly cards: Array<Card>;
  findCardOnTheTable(cardId: number): Card | null;
  cardsWithout(cardId: number): Array<Card>;
  dispenserWithout(energy: EnergyType): Array<EnergyType>;
  dispenserWithoutInternal(index: number): [EnergyType, Array<EnergyType>];
}

export const InitialGameState: GameState = {
  dispenser: initialDispenser,
  cards: CardsList,

  findCardOnTheTable(cardId: number): Card | null {
    const card = this.cards.find(c => c.cardId === cardId);
    return typeof card === "undefined" ? null : card;
  },

  cardsWithout(cardId: number): Array<Card> {
    let cards = [...this.cards];
    cards = cards.filter((c: Card) => c.cardId != cardId);
    return cards;
  },

  dispenserWithout(energy: EnergyType): Array<EnergyType> {
    let i = this.dispenser.indexOf(energy);
    return this.dispenserWithoutInternal(i)[1];
  },

  dispenserWithoutInternal(index: number): [EnergyType, Array<EnergyType>] {
    let dispenser = [...this.dispenser];
    let energy = dispenser[index];
    dispenser = dispenser
      .slice(0, index)
      .concat(dispenser.slice(index + 1, dispenser.length));

    return [energy, dispenser];
  }
};

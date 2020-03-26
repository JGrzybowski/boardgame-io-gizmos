import { Card } from "./cards/card";
import { EnergyType, initialDispenser } from "./basicGameElements";
import { CardsList } from "./cards/cardsList";

export interface GameState {
  readonly dispenser: Array<EnergyType>;
  readonly cards: Array<Card>;
}

export const InitialGameState = {
  dispenser: initialDispenser,
  cards: CardsList
};

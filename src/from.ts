import { CardLevel, CardInfo } from "./cards/cardInfo";
import { GameState, GameS, CardPicker } from "./gameState";

export class From {
  static TopOfPile(lvl: CardLevel, n: number): CardPicker<GameState> {
    return (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
      const pickedCards = G.cards
        .filter((c) => c.level === lvl)
        .slice(G.visibleCardsLimits[lvl], n + G.visibleCardsLimits[lvl]);
      const pickedIds = pickedCards.map((c) => c.cardId);
      const gAfterPick = new GameS({ ...G, cards: G.cards.filter((c: CardInfo) => !pickedIds.includes(c.cardId)) });
      return [gAfterPick, pickedCards];
    };
  }
}

import { CardPutter, GameState, GameS } from "./gameState";
import { CardInfo } from "./cards/cardInfo";

export class To {
  static BottomOfPile(): CardPutter<GameState> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const cards = [...G.cards, ...newCards];
      const gAfterPut = new GameS({ ...G, cards });
      return gAfterPut;
    };
  }
}

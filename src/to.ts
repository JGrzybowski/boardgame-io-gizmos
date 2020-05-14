import { CardPutter, GameState, GameS } from "./gameState";
import { CardInfo } from "./cards/cardInfo";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";

export class To {
  static BottomOfPile(): CardPutter<GameState> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const cards = [...G.cards, ...newCards];
      const gAfterPut = new GameS({ ...G, cards });
      return gAfterPut;
    };
  }

  static CardToBuild(): CardPutter<GameState> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      if (newCards.length !== 1) throw new Error("Only one card can be put to Card to be built slot");
      if (G.cardToBeBuilt) throw new Error("Only one card can be put to Card to be built slot");

      const cardToBeBuilt = newCards[0];
      const cardToBeBuiltCost = EnergyTypeDictionary.fromTypeAndAmount(cardToBeBuilt.color, cardToBeBuilt.cost);

      const gAfterPut = new GameS({ ...G, cardToBeBuilt, cardToBeBuiltCost });
      return gAfterPut;
    };
  }
}

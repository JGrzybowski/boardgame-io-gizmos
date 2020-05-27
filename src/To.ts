import { MultiPutter, GameState, GameS, Putter } from "./gameState";
import { CardInfo } from "./cards/cardInfo";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerID } from "boardgame.io";
import { PlayerState } from "./playerState";

export class To {
  static BottomOfPile(): MultiPutter<CardInfo> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const cards = [...G.cards, ...newCards];
      const gAfterPut = new GameS({ ...G, cards });
      return gAfterPut;
    };
  }

  static CardToBuild(): Putter<CardInfo> {
    return (G: GameState, cardToBeBuilt: CardInfo): GameState => {
      if (G.cardToBeBuilt) throw new Error("Only one card can be put to Card to be built slot");

      const cardToBeBuiltCost = EnergyTypeDictionary.fromTypeAndAmount(cardToBeBuilt.color, cardToBeBuilt.cost);
      const gAfterPut = new GameS({ ...G, cardToBeBuilt, cardToBeBuiltCost });
      return gAfterPut;
    };
  }

  static PlayerCards(playerId: PlayerID): MultiPutter<CardInfo> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const playerStateAfter = newCards.reduce(
        (p: PlayerState, card: CardInfo) => p.withAddedCardToMachines(card),
        G.players[playerId]
      );

      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);

      return gAfterPut;
    };
  }

  static PlayerArchive(playerId: PlayerID): MultiPutter<CardInfo> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const playerState = G.players[playerId];
      if (playerState.archiveLimit < playerState.archive.length + newCards.length)
        throw new Error("The amount of new cards would cause to go above archive limit.");

      const playerStateAfter = newCards.reduce(
        (p: PlayerState, card: CardInfo) => p.withAddedCardToArchive(card),
        playerState
      );

      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
      return gAfterPut;
    };
  }

  static PlayerResearched(playerId: PlayerID): MultiPutter<CardInfo> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const playerState = G.players[playerId];
      if (playerState.researchLimit < playerState.researched.length + newCards.length)
        throw new Error("The amount of new cards would cause to go above research limit.");

      const playerStateAfter = playerState.withCardsAddedToResearched(newCards);

      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
      return gAfterPut;
    };
  }
}

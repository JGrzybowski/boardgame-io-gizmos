import { CardLevel, CardInfo } from "./cards/cardInfo";
import { GameState, GameS, CardPicker } from "./gameState";
import { Game, PlayerID } from "boardgame.io";
import { researchAction } from "./moves/research";
import { researchStage } from "./stages/researchStage";

export class From {
  static TopOfPile(lvl: CardLevel, n: number): CardPicker<GameState> {
    return (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
      const pickedCards = G.cards
        .filter((c) => c.level === lvl)
        .slice(G.visibleCardsLimits[lvl], n + G.visibleCardsLimits[lvl]);
      const pickedIds = pickedCards.map((c) => c.cardId);

      const cards = G.cards.filter((c: CardInfo) => !pickedIds.includes(c.cardId));
      const gAfterPick = new GameS({ ...G, cards });
      return [gAfterPick, pickedCards];
    };
  }

  static Table(cardId: number): CardPicker<GameState> {
    return (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
      const selectedCards = G.cards.filter((c) => c.cardId === cardId);
      if (selectedCards.length < 1) throw new Error("Card with given id is not on the table.");
      if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

      const selectedCard = selectedCards[0];
      const isCardVisible =
        G.cards.slice(0, G.visibleCardsLimits[selectedCard.level]).filter((c) => c.cardId === cardId).length === 1;

      if (!isCardVisible) throw new Error("This move should pick exactly one card and it must be visible.");

      const cards = G.cards.filter((c: CardInfo) => c.cardId !== selectedCard.cardId);
      const gAfterPick = new GameS({ ...G, cards });
      return [gAfterPick, selectedCards];
    };
  }

  static CardToBuild(): CardPicker<GameState> {
    return (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
      if (!G.cardToBeBuilt) throw new Error("There is no card to be built.");

      const cards = G.cardsWithout(G.cardToBeBuilt.cardId);
      const newGameState: GameState = new GameS({ ...G, cards: cards, cardToBeBuilt: null, cardToBeBuiltCost: null });
      return [newGameState, [G.cardToBeBuilt]];
    };
  }

  static PlayerResearched(playerId: PlayerID, cardId?: number): CardPicker<GameState> {
    return (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
      const playerState = G.players[playerId];
      if (!playerState) throw new Error("There is no player with such ID");

      const researchedCards = playerState.researched;
      if (researchedCards.length === 0) throw new Error("The researched collection is empty, you cannot take from it.");
      const selectedCards = cardId ? researchedCards.filter((c) => c.cardId === cardId) : researchedCards;
      if (cardId && selectedCards.length < 1)
        throw new Error("Card with given id is not in the researched collection.");
      if (cardId && selectedCards.length > 1) throw new Error("There is more than one card with given id");

      const playerStateAfter = cardId
        ? playerState.withRemovedCardFromResearched(cardId)
        : playerState.withResearchedCleared();
      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
      return [gAfterPut, selectedCards];
    };
  }
}

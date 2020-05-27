import { CardLevel, CardInfo } from "./cards/cardInfo";
import { GameState, GameS, CardsPicker, CardPicker } from "./gameState";
import { PlayerID } from "boardgame.io";

export class From {
  static TopOfPile(lvl: CardLevel, n: number): CardsPicker<GameState> {
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
    return (G: GameState): [GameState, CardInfo] => {
      const selectedCards = G.cards.filter((c) => c.cardId === cardId);
      if (selectedCards.length < 1) throw new Error("Card with given id is not on the table.");
      if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

      const selectedCard = selectedCards[0];
      const isCardVisible =
        G.cards.slice(0, G.visibleCardsLimits[selectedCard.level]).filter((c) => c.cardId === cardId).length === 1;

      if (!isCardVisible) throw new Error("This move should pick exactly one card and it must be visible.");

      const cards = G.cards.filter((c: CardInfo) => c.cardId !== selectedCard.cardId);
      const gAfterPick = new GameS({ ...G, cards });
      return [gAfterPick, selectedCard];
    };
  }

  static CardToBuild(): CardPicker<GameState> {
    return (G: GameState): [GameState, CardInfo] => {
      if (!G.cardToBeBuilt) throw new Error("There is no card to be built.");

      const cards = G.cardsWithout(G.cardToBeBuilt.cardId);
      const newGameState: GameState = new GameS({ ...G, cards: cards, cardToBeBuilt: null, cardToBeBuiltCost: null });
      return [newGameState, G.cardToBeBuilt];
    };
  }

  static PlayerResearched(playerId: PlayerID, cardId: number): CardPicker<GameState>;
  static PlayerResearched(playerId: PlayerID): CardsPicker<GameState>;
  static PlayerResearched(playerId: PlayerID, cardId?: number): CardPicker<GameState> | CardsPicker<GameState> {
    if (cardId) {
      return (G: GameState): [GameState, CardInfo] => {
        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with such ID");

        const selectedCards = playerState.researched.filter((c) => c.cardId === cardId);
        if (selectedCards.length < 1) throw new Error("Card with given id is not in the researched collection.");
        if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

        const playerStateAfter = playerState.withRemovedCardFromResearched(cardId);
        const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
        return [gAfterPut, selectedCards[0]];
      };
    }

    return (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
      const playerState = G.players[playerId];
      if (!playerState) throw new Error("There is no player with such ID");

      const researchedCards = playerState.researched;
      if (researchedCards.length === 0) throw new Error("The researched collection is empty, you cannot take from it.");

      const playerStateAfter = playerState.withResearchedCleared();
      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
      return [gAfterPut, researchedCards];
    };
  }

  static PlayerArchive(playerId: PlayerID, cardId: number) {
    return (G: GameState): [GameState, CardInfo] => {
      const playerState = G.players[playerId];
      if (!playerState) throw new Error("There is no player with such ID");

      const selectedCards = playerState.archive.filter((c) => c.cardId === cardId);
      if (selectedCards.length < 1) throw new Error("Card with given id is not in the archive collection.");
      if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

      const playerStateAfter = playerState.withRemovedCardFromArchive(cardId);
      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
      return [gAfterPut, selectedCards[0]];
    };
  }
}
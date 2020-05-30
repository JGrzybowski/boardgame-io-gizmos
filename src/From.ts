import { CardLevel, CardInfo } from "./cards/cardInfo";
import { GameState, GameS, MultiPicker, Picker, GameStateData } from "./gameState";
import { PlayerID } from "boardgame.io";
import { EnergyType } from "./basicGameElements";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerState } from "./playerState";
import { ExtractFrom, WithIndex } from "./cards/cardsCollection";

export class From {
  static TopOfPile(lvl: CardLevel, n: number): MultiPicker<CardInfo> {
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

  static Table(cardId: number): Picker<CardInfo> {
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

  static CardToBuild(): Picker<CardInfo> {
    return (G: GameState): [GameState, CardInfo] => {
      if (!G.cardToBeBuilt) throw new Error("There is no card to be built.");

      const newGameState: GameState = new GameS({
        ...G,
        cardToBeBuilt: null,
        cardToBeBuiltCost: null,
      });
      return [newGameState, G.cardToBeBuilt];
    };
  }

  static PlayerResearched(playerId: PlayerID, cardId: number): Picker<CardInfo>;
  static PlayerResearched(playerId: PlayerID): MultiPicker<CardInfo>;
  static PlayerResearched(playerId: PlayerID, cardId?: number): Picker<CardInfo> | MultiPicker<CardInfo> {
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

  static PlayerArchive(playerId: PlayerID, cardId: number): Picker<CardInfo> {
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

  static PlayerEnergyStorage(playerId: PlayerID, energyType: EnergyType): Picker<EnergyTypeDictionary> {
    return (G: GameState): [GameState, EnergyTypeDictionary] => {
      if (energyType === EnergyType.Any) throw new Error("Player Energy storage cannot store (Any) energy");

      const playerState = G.players[playerId];
      if (playerState.energyStorage.get(energyType) <= 0) throw new Error("Selected energy cannot be taken");

      const reduction = EnergyTypeDictionary.fromTypeAndAmount(energyType, 1);
      const newEnergyStorage = playerState.energyStorage.subtract(reduction);

      const newPlayerState = new PlayerState({ ...playerState, energyStorage: newEnergyStorage });
      const newGameState = G.withUpdatedPlayer(playerId, newPlayerState);
      return [newGameState, reduction];
    };
  }

  static EnergyRow(index: number): Picker<EnergyTypeDictionary> {
    return (G: GameState): [GameState, EnergyTypeDictionary] => {
      if (index < 0) throw new Error("Index must be non negative number");
      if (index > G.energyRow.length - 1) throw new Error("Index must be in range 0 to length of the EnergyRow array");
      const [energyRow, selectedEnergy] = ExtractFrom(G.energyRow, WithIndex(index));
      const newGameState = new GameS({ ...G, energyRow });
      return [newGameState, EnergyTypeDictionary.fromTypeAndAmount(selectedEnergy, 1)];
    };
  }
}

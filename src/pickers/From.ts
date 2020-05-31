import { CardLevel, CardInfo } from "../cards/cardInfo";
import { GameState, GameS, MultiPickerFunction, PickerFunction } from "../gameState";
import { PlayerID } from "boardgame.io";
import { EnergyType, repeat } from "../basicGameElements";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { PlayerState } from "../playerState";
import { ExtractFrom, WithIndex, CardWithId } from "../cards/cardsCollection";

export class From {
  static TopOfPile(lvl: CardLevel, n: number): MultiPickerFunction<CardInfo> {
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

  static Table(cardId: number): PickerFunction<CardInfo> {
    return (G: GameState): [GameState, CardInfo] => {
      const selectedCards = G.cards.filter(CardWithId(cardId));
      if (selectedCards.length < 1) throw new Error("Card with given id is not on the table.");
      if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

      const [cards, selectedCard] = ExtractFrom(G.cards, CardWithId(cardId));

      const isCardVisible =
        G.cards.slice(0, G.visibleCardsLimits[selectedCard.level]).filter(CardWithId(cardId)).length === 1;
      if (!isCardVisible) throw new Error("This move should pick exactly one card and it must be visible.");

      const gAfterPick = new GameS({ ...G, cards });
      return [gAfterPick, selectedCard];
    };
  }

  static CardToBuild(): PickerFunction<CardInfo> {
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

  static PlayerResearched(playerId: PlayerID, cardId: number): PickerFunction<CardInfo>;
  static PlayerResearched(playerId: PlayerID): MultiPickerFunction<CardInfo>;
  static PlayerResearched(
    playerId: PlayerID,
    cardId?: number
  ): PickerFunction<CardInfo> | MultiPickerFunction<CardInfo> {
    if (cardId) {
      return (G: GameState): [GameState, CardInfo] => {
        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with such ID");

        const selectedCards = playerState.researched.filter(CardWithId(cardId));
        if (selectedCards.length < 1) throw new Error("Card with given id is not in the researched collection.");
        if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

        const [researched, selectedCard] = ExtractFrom(playerState.researched, CardWithId(cardId));
        const playerStateAfter = new PlayerState({ ...playerState, researched });
        const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
        return [gAfterPut, selectedCard];
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

  static PlayerArchive(playerId: PlayerID, cardId: number): PickerFunction<CardInfo> {
    return (G: GameState): [GameState, CardInfo] => {
      const playerState = G.players[playerId];
      if (!playerState) throw new Error("There is no player with such ID");

      const selectedCards = playerState.archive.filter((c) => c.cardId === cardId);
      if (selectedCards.length < 1) throw new Error("Card with given id is not in the archive collection.");
      if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

      const [archive, selectedCard] = ExtractFrom(playerState.archive, CardWithId(cardId));
      const playerStateAfter = new PlayerState({ ...playerState, archive });
      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
      return [gAfterPut, selectedCard];
    };
  }

  static PlayerEnergyStorage(playerId: PlayerID, energyType: EnergyType): PickerFunction<EnergyTypeDictionary> {
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

  static EnergyRow(index: number): PickerFunction<EnergyTypeDictionary> {
    return (G: GameState): [GameState, EnergyTypeDictionary] => {
      if (index < 0) throw new Error("Index must be non negative number");
      if (index > G.energyRow.length - 1) throw new Error("Index must be in range 0 to length of the EnergyRow array");
      const [energyRow, selectedEnergy] = ExtractFrom(G.energyRow, WithIndex(index));
      const newGameState = new GameS({ ...G, energyRow });
      const reduction = EnergyTypeDictionary.fromTypeAndAmount(selectedEnergy, 1);
      return [newGameState, reduction];
    };
  }

  static Dispenser(selectorFunction: (n: number) => number): PickerFunction<EnergyType> {
    return (G: GameState): [GameState, EnergyType] => {
      const n = G.dispenser.R + G.dispenser.U + G.dispenser.B + G.dispenser.Y;
      const index = selectorFunction(n);
      if (index < 0 || index > n)
        throw new Error("The index calculated by the function must be in the index range from 0 to n");
      const dispenserArray = [
        ...repeat(EnergyType.Red, G.dispenser.R),
        ...repeat(EnergyType.Blue, G.dispenser.U),
        ...repeat(EnergyType.Black, G.dispenser.B),
        ...repeat(EnergyType.Yellow, G.dispenser.Y),
      ];

      const selectedEnergy = dispenserArray[index];
      const reduction = EnergyTypeDictionary.fromTypeAndAmount(selectedEnergy, 1);
      const dispenser = G.dispenser.subtract(reduction);
      const newGameState = new GameS({ ...G, dispenser });
      return [newGameState, selectedEnergy];
    };
  }
}

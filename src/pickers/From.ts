import { CardInfo } from "../cards/cardInfo";
import { GameState, GameS, PilesCardLevel } from "../gameState";
import { PlayerID } from "boardgame.io";
import { EnergyType } from "../energyType";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { PlayerState } from "../playerState";
import { ExtractFrom, WithIndex, CardWithId } from "../cards/cardsCollection";
import Picker from "./picker";
import MultiPicker from "./multiPicker";

function* repeat<T>(x: T, n: number): Generator<T> {
  while (n-- > 0) yield x;
}

export class From {
  static TopOfPile(lvl: PilesCardLevel, n: number): MultiPicker<CardInfo> {
    return {
      canPickMultiple: (G: GameState): boolean => {
        if (G.pileCardsOfLevel(lvl).length < 1) return false;
        return true;
      },
      pickMultiple: (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
        if (G.pileCardsOfLevel(lvl).length < 1) throw new Error("There are no cards in the pile to be picked");

        const pickedCards = G.pileCardsOfLevel(lvl).slice(0, n);
        const pickedIds = pickedCards.map((c) => c.cardId);
        const pileCards = G.pileCards.filter((c: CardInfo) => !pickedIds.includes(c.cardId));

        const gAfterPick = new GameS({ ...G, pileCards });
        return [gAfterPick, pickedCards];
      },
    };
  }

  static Table(cardId: number): Picker<CardInfo> {
    return {
      canPick: (G: GameState): boolean => {
        const selectedCards = G.visibleCards.filter(CardWithId(cardId));
        if (selectedCards.length < 1) return false;
        if (selectedCards.length > 1) return false;
        return true;
      },
      pick: (G: GameState): [GameState, CardInfo] => {
        const selectedCards = G.visibleCards.filter(CardWithId(cardId));
        if (selectedCards.length < 1) throw new Error("Card with given id is not on the table.");
        if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

        const [visibleCards, selectedCard] = ExtractFrom(G.visibleCards, CardWithId(cardId));
        const gAfterPick = new GameS({ ...G, visibleCards });
        return [gAfterPick, selectedCard];
      },
    };
  }

  static CardToBuild(): Picker<CardInfo> {
    return {
      canPick: (G: GameState): boolean => {
        if (!G.cardToBeBuilt) return false;
        return true;
      },
      pick: (G: GameState): [GameState, CardInfo] => {
        if (!G.cardToBeBuilt) throw new Error("There is no card to be built.");

        const newGameState: GameState = new GameS({
          ...G,
          cardToBeBuilt: null,
          cardToBeBuiltCost: null,
          cardToBeBuiltSource: null,
        });
        return [newGameState, G.cardToBeBuilt];
      },
    };
  }

  static PlayerResearched(playerId: PlayerID, cardId: number): Picker<CardInfo>;
  static PlayerResearched(playerId: PlayerID): MultiPicker<CardInfo>;
  static PlayerResearched(playerId: PlayerID, cardId?: number): Picker<CardInfo> | MultiPicker<CardInfo> {
    if (cardId) {
      return {
        canPick: (G: GameState): boolean => {
          const playerState = G.players[playerId];
          if (!playerState) return false;

          const selectedCards = playerState.researched.filter(CardWithId(cardId));
          if (selectedCards.length < 1) return false;
          if (selectedCards.length > 1) return false;
          return true;
        },
        pick: (G: GameState): [GameState, CardInfo] => {
          const playerState = G.players[playerId];
          if (!playerState) throw new Error("There is no player with such ID");

          const selectedCards = playerState.researched.filter(CardWithId(cardId));
          if (selectedCards.length < 1) throw new Error("Card with given id is not in the researched collection.");
          if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

          const [researched, selectedCard] = ExtractFrom(playerState.researched, CardWithId(cardId));
          const playerStateAfter = new PlayerState({ ...playerState, researched });
          const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
          return [gAfterPut, selectedCard];
        },
      };
    }
    return {
      canPickMultiple: (G: GameState): boolean => {
        const playerState = G.players[playerId];
        if (!playerState) return false;

        const researchedCards = playerState.researched;
        if (researchedCards.length === 0) return false;
        return true;
      },
      pickMultiple: (G: GameState): [GameState, ReadonlyArray<CardInfo>] => {
        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with such ID");

        const researchedCards = playerState.researched;
        if (researchedCards.length === 0)
          throw new Error("The researched collection is empty, you cannot take from it.");

        const playerStateAfter = playerState.withResearchedCleared();
        const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
        return [gAfterPut, researchedCards];
      },
    };
  }

  static PlayerArchive(playerId: PlayerID, cardId: number): Picker<CardInfo> {
    return {
      canPick: (G: GameState): boolean => {
        const playerState = G.players[playerId];
        if (!playerState) return false;

        const selectedCards = playerState.archive.filter(CardWithId(cardId));
        if (selectedCards.length < 1) return false;
        if (selectedCards.length > 1) return false;
        return true;
      },
      pick: (G: GameState): [GameState, CardInfo] => {
        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with such ID");

        const selectedCards = playerState.archive.filter((c) => c.cardId === cardId);
        if (selectedCards.length < 1) throw new Error("Card with given id is not in the archive collection.");
        if (selectedCards.length > 1) throw new Error("There is more than one card with given id");

        const [archive, selectedCard] = ExtractFrom(playerState.archive, CardWithId(cardId));
        const playerStateAfter = new PlayerState({ ...playerState, archive });
        const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
        return [gAfterPut, selectedCard];
      },
    };
  }

  static PlayerEnergyStorage(playerId: PlayerID, energyType: EnergyType): Picker<EnergyTypeDictionary> {
    return {
      canPick: (G: GameState): boolean => {
        if (energyType === EnergyType.Any) return false;

        const playerState = G.players[playerId];
        if (!playerState) return false;
        if (playerState.energyStorage.get(energyType) <= 0) return false;
        return true;
      },
      pick: (G: GameState): [GameState, EnergyTypeDictionary] => {
        if (energyType === EnergyType.Any) throw new Error("Player Energy storage cannot store (Any) energy");

        const playerState = G.players[playerId];
        if (!playerState) throw new Error("Player with given id does not exist.");
        if (playerState.energyStorage.get(energyType) <= 0) throw new Error("Selected energy cannot be taken");

        const reduction = EnergyTypeDictionary.fromTypeAndAmount(energyType, 1);
        const newEnergyStorage = playerState.energyStorage.subtract(reduction);

        const newPlayerState = new PlayerState({ ...playerState, energyStorage: newEnergyStorage });
        const newGameState = G.withUpdatedPlayer(playerId, newPlayerState);
        return [newGameState, reduction];
      },
    };
  }

  static EnergyRow(index: number): Picker<EnergyTypeDictionary> {
    return {
      canPick: (G: GameState): boolean => {
        if (index < 0) return false;
        if (index > G.energyRow.length - 1) return false;
        return true;
      },
      pick: (G: GameState): [GameState, EnergyTypeDictionary] => {
        if (index < 0) throw new Error("Index must be non negative number");
        if (index > G.energyRow.length - 1)
          throw new Error("Index must be in range 0 to length of the EnergyRow array");

        const [energyRow, selectedEnergy] = ExtractFrom(G.energyRow, WithIndex(index));
        const newGameState = new GameS({ ...G, energyRow });
        const reduction = EnergyTypeDictionary.fromTypeAndAmount(selectedEnergy, 1);
        return [newGameState, reduction];
      },
    };
  }

  static Dispenser(selectorFunction: (n: number) => number): Picker<EnergyType> {
    return {
      canPick: (G: GameState): boolean => {
        const n = G.dispenser.R + G.dispenser.U + G.dispenser.B + G.dispenser.Y;
        // HACK: Does not save the selected index for later, for random functions that could cause a different index durring pick execution
        const index = selectorFunction(n);
        if (index < 0 || index > n) return false;
        return true;
      },
      pick: (G: GameState): [GameState, EnergyType] => {
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
      },
    };
  }
}

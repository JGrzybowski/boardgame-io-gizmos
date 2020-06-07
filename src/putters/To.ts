import { GameState, GameS } from "../gameState";
import { CardInfo } from "../cards/cardInfo";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { PlayerID } from "boardgame.io";
import { PlayerState } from "../playerState";
import { EnergyType } from "../energyType";
import MultiPutter from "./multiPutter";
import Putter from "./putter";

export class To {
  static BottomOfPile(): MultiPutter<CardInfo> {
    return {
      canPutMultiple: (): boolean => {
        return true;
      },
      putMultiple: (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
        const pileCards = [...G.pileCards, ...newCards];
        const gAfterPut = new GameS({ ...G, pileCards });
        return gAfterPut;
      },
    };
  }

  static CardToBuild(): Putter<CardInfo> {
    return {
      canPut: (G: GameState): boolean => {
        if (G.cardToBeBuilt) return false;
        return true;
      },
      put: (G: GameState, cardToBeBuilt: CardInfo): GameState => {
        if (G.cardToBeBuilt) throw new Error("Only one card can be put to Card to be built slot");

        const cardToBeBuiltCost = EnergyTypeDictionary.fromTypeAndAmount(cardToBeBuilt.color, cardToBeBuilt.cost);
        const gAfterPut = new GameS({ ...G, cardToBeBuilt, cardToBeBuiltCost });
        return gAfterPut;
      },
    };
  }

  static PlayerCards(playerId: PlayerID): MultiPutter<CardInfo> {
    return {
      canPutMultiple: (G: GameState): boolean => {
        if (!G.players[playerId]) return false;
        return true;
      },
      putMultiple: (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with such id");

        const playerStateAfter = newCards.reduce(
          (p: PlayerState, card: CardInfo) => p.withAddedCardToMachines(card),
          playerState
        );

        const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
        return gAfterPut;
      },
    };
  }

  static PlayerArchive(playerId: PlayerID): MultiPutter<CardInfo> {
    return {
      canPutMultiple: (G: GameState, newCards: ReadonlyArray<CardInfo>): boolean => {
        const playerState = G.players[playerId];
        if (!playerState) return false;

        if (playerState.archiveLimit < playerState.archive.length + newCards.length) return false;

        return true;
      },
      putMultiple: (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with given id.");

        if (playerState.archiveLimit < playerState.archive.length + newCards.length)
          throw new Error("The amount of new cards would cause to go above archive limit.");

        const playerStateAfter = newCards.reduce(
          (p: PlayerState, card: CardInfo) => p.withAddedCardToArchive(card),
          playerState
        );

        const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
        return gAfterPut;
      },
    };
  }

  static PlayerResearched(playerId: PlayerID): MultiPutter<CardInfo> {
    return {
      canPutMultiple: (G: GameState, newCards: ReadonlyArray<CardInfo>): boolean => {
        const playerState = G.players[playerId];
        if (!playerState) return false;
        if (playerState.researchLimit < playerState.researched.length + newCards.length) return false;
        return true;
      },
      putMultiple: (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with given id.");

        if (playerState.researchLimit < playerState.researched.length + newCards.length)
          throw new Error("The amount of new cards would cause to go above research limit.");
        const playerStateAfter = playerState.withCardsAddedToResearched(newCards);

        const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
        return gAfterPut;
      },
    };
  }

  static Dispenser(): Putter<EnergyTypeDictionary> {
    return {
      canPut: (G: GameState, energyAmounts: EnergyTypeDictionary): boolean => {
        if (energyAmounts.isPaid()) return false;
        if (energyAmounts.Any !== 0) return false;
        return true;
      },
      put: (G: GameState, energyAmounts: EnergyTypeDictionary): GameState => {
        if (energyAmounts.isPaid()) throw new Error("Cannot add zero energy to the dispenser");
        if (energyAmounts.Any !== 0) throw new Error("Cannot add energy od type Any to the dispenser");

        const dispenser = G.dispenser.add(energyAmounts);
        const newGameState = new GameS({ ...G, dispenser });
        return newGameState;
      },
    };
  }

  static EnergyRow(): Putter<EnergyType> {
    return {
      canPut: (G: GameState, energyType: EnergyType): boolean => {
        if (energyType === EnergyType.Any) return false;
        if (G.energyRow.length >= G.energyRowSize) return false;
        return true;
      },
      put: (G: GameState, energyType: EnergyType): GameState => {
        if (energyType === EnergyType.Any) throw new Error("Cannot add energyof type Any to the energy row");
        if (G.energyRow.length >= G.energyRowSize) throw new Error("Cannot add more energy to full energy row");

        const energyRow = G.energyRow.concat([energyType]);
        const newGameState = new GameS({ ...G, energyRow });
        return newGameState;
      },
    };
  }

  static PlayerEnergyStorage(playerId: PlayerID): Putter<EnergyTypeDictionary> {
    return {
      canPut: (G: GameState, energyAmounts: EnergyTypeDictionary): boolean => {
        if (energyAmounts.isPaid()) return false;
        if (energyAmounts.Any !== 0) return false;

        const playerState = G.players[playerId];
        if (!playerState) return false;
        //TODO check if storage has capacity

        return true;
      },
      put: (G: GameState, energyAmounts: EnergyTypeDictionary): GameState => {
        if (energyAmounts.isPaid()) throw new Error("Cannot add zer0 energy to player's energy storage");
        if (energyAmounts.Any !== 0) throw new Error("Cannot add energy of type Any to player's energy storage");

        const playerState = G.players[playerId];
        if (!playerState) throw new Error("There is no player with given id.");

        const energyStorage = playerState.energyStorage.add(energyAmounts);
        const newPlayerState = new PlayerState({ ...playerState, energyStorage });
        const newGameState = G.withUpdatedPlayer(playerId, newPlayerState);
        return newGameState;
      },
    };
  }
}

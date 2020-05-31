import { MultiPutterFunction, GameState, GameS, PutterFunction } from "../gameState";
import { CardInfo } from "../cards/cardInfo";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { PlayerID } from "boardgame.io";
import { PlayerState } from "../playerState";
import { EnergyType } from "../basicGameElements";

export class To {
  static BottomOfPile(): MultiPutterFunction<CardInfo> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const cards = [...G.cards, ...newCards];
      const gAfterPut = new GameS({ ...G, cards });
      return gAfterPut;
    };
  }

  static CardToBuild(): PutterFunction<CardInfo> {
    return (G: GameState, cardToBeBuilt: CardInfo): GameState => {
      if (G.cardToBeBuilt) throw new Error("Only one card can be put to Card to be built slot");

      const cardToBeBuiltCost = EnergyTypeDictionary.fromTypeAndAmount(cardToBeBuilt.color, cardToBeBuilt.cost);
      const gAfterPut = new GameS({ ...G, cardToBeBuilt, cardToBeBuiltCost });
      return gAfterPut;
    };
  }

  static PlayerCards(playerId: PlayerID): MultiPutterFunction<CardInfo> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const playerStateAfter = newCards.reduce(
        (p: PlayerState, card: CardInfo) => p.withAddedCardToMachines(card),
        G.players[playerId]
      );

      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);

      return gAfterPut;
    };
  }

  static PlayerArchive(playerId: PlayerID): MultiPutterFunction<CardInfo> {
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

  static PlayerResearched(playerId: PlayerID): MultiPutterFunction<CardInfo> {
    return (G: GameState, newCards: ReadonlyArray<CardInfo>): GameState => {
      const playerState = G.players[playerId];
      if (playerState.researchLimit < playerState.researched.length + newCards.length)
        throw new Error("The amount of new cards would cause to go above research limit.");

      const playerStateAfter = playerState.withCardsAddedToResearched(newCards);

      const gAfterPut = G.withUpdatedPlayer(playerId, playerStateAfter);
      return gAfterPut;
    };
  }

  static Dispenser(): PutterFunction<EnergyTypeDictionary> {
    return (G: GameState, energyAmounts: EnergyTypeDictionary): GameState => {
      if (energyAmounts.isPaid()) throw new Error("Cannot add zero energy to the dispenser");
      if (energyAmounts.Any !== 0) throw new Error("Cannot add energy od type Any to the dispenser");
      const dispenser = G.dispenser.add(energyAmounts);
      const newGameState = new GameS({ ...G, dispenser });
      return newGameState;
    };
  }

  static EnergyRow(): PutterFunction<EnergyType> {
    return (G: GameState, energyType: EnergyType): GameState => {
      if (energyType === EnergyType.Any) throw new Error("Cannot add energyof type Any to the energy row");
      const energyRow = G.energyRow.concat([energyType]);
      const newGameState = new GameS({ ...G, energyRow });
      return newGameState;
    };
  }

  static PlayerEnergyStorage(playerId: PlayerID): PutterFunction<EnergyTypeDictionary> {
    return (G: GameState, energyAmounts: EnergyTypeDictionary): GameState => {
      if (energyAmounts.isPaid()) throw new Error("Cannot add zer0 energy to player's energy storage");
      if (energyAmounts.Any !== 0) throw new Error("Cannot add energy of type Any to player's energy storage");
      const playerState = G.players[playerId];
      const energyStorage = playerState.energyStorage.add(energyAmounts);
      const newPlayerState = new PlayerState({ ...playerState, energyStorage });
      const newGameState = G.withUpdatedPlayer(playerId, newPlayerState);
      return newGameState;
    };
  }
}

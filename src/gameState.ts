import { CardInfo, CardLevel } from "./cards/cardInfo";
import { EnergyType } from "./basicGameElements";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerState } from "./playerState";
import { Ctx, PlayerID } from "boardgame.io";
import { GameContext } from "./gameContext";

export type PickerFunction<T> = (source: GameState) => [GameState, T];
export type PutterFunction<T> = (destination: GameState, cards: T) => GameState;
export type MultiPickerFunction<T> = (source: GameState) => [GameState, ReadonlyArray<T>];
export type MultiPutterFunction<T> = (destination: GameState, cards: ReadonlyArray<T>) => GameState;

function isPicker<T>(x: Function): x is PickerFunction<T> {
  if (x as PickerFunction<T>) return true;
  return false;
}
function isMultiPicker<T>(x: Function): x is MultiPickerFunction<T> {
  if (x as MultiPickerFunction<T>) return true;
  return false;
}
function isPutter<T>(x: Function): x is PutterFunction<T> {
  if (x as PutterFunction<T>) return true;
  return false;
}
function isMultiPutter<T>(x: Function): x is MultiPutterFunction<T> {
  if (x as MultiPutterFunction<T>) return true;
  return false;
}

export type PilesCardLevel = 1 | 2 | 3;

export interface GameState {
  readonly energyRow: ReadonlyArray<EnergyType>;
  readonly dispenser: EnergyTypeDictionary;
  readonly cards: ReadonlyArray<CardInfo>;
  readonly players: { [id: string]: PlayerState };
  readonly energyRowSize: number;
  readonly cardToBeBuilt: CardInfo | null;
  readonly cardToBeBuiltCost: EnergyTypeDictionary | null;
  readonly visibleCardsLimits: ReadonlyArray<number>;

  readonly previousStageName: string | null;
  readonly playerStateBeforeBuild: PlayerState | null;
  readonly gameStateBeforeBuild: GameState | null;

  withCardRemovedFromTable(cardId: number): GameState;
  withCardsPutOnBottom(cards: ReadonlyArray<CardInfo>): GameState;

  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: EnergyTypeDictionary): GameState;

  withCardToBeBuiltCleared(): GameState;

  withPlayerAndGameStateSaved(ctx: Ctx): GameState;

  withEnergyRemovedFromCost(paidFor: EnergyType): GameState;
  withEnergyAddedToCost(changeTo: EnergyType): GameState;

  withShuffeledCards(ctx: GameContext): GameState;

  getPlayer(playerId: string): PlayerState | null;
  visibleCards(level: CardLevel): ReadonlyArray<CardInfo>;

  moveCard(from: PickerFunction<CardInfo>, into: PutterFunction<CardInfo>): GameState;
  moveCard(from: PickerFunction<CardInfo>, into: MultiPutterFunction<CardInfo>): GameState;
  moveCard(from: MultiPickerFunction<CardInfo>, into: MultiPutterFunction<CardInfo>): GameState;

  moveEnergy<T = EnergyType | EnergyTypeDictionary>(from: PickerFunction<T>, to: PutterFunction<T>): GameState;

  withUpdatedPlayer(playerId: string, playerStateAfter: PlayerState): GameState;
}

export interface GameStateData {
  readonly energyRow?: ReadonlyArray<EnergyType>;
  readonly dispenser?: EnergyTypeDictionary;
  readonly cards?: ReadonlyArray<CardInfo>;
  readonly players?: { [id: string]: PlayerState };
  readonly energyRowSize?: number;
  readonly cardToBeBuilt?: CardInfo | null;
  readonly cardToBeBuiltCost?: EnergyTypeDictionary | null;
  readonly visibleCardsLimits?: ReadonlyArray<number>;
  readonly previousStageName?: string | null;
  readonly playerStateBeforeBuild?: PlayerState | null;
  readonly gameStateBeforeBuild?: GameState | null;
}

export class GameS implements GameState {
  constructor(initialGameState: GameStateData) {
    const {
      energyRow = [],
      dispenser = new EnergyTypeDictionary(13, 13, 13, 13, 0),
      cards = [],
      players = {},
      energyRowSize = 6,
      cardToBeBuilt = null,
      cardToBeBuiltCost = null,
      visibleCardsLimits = [0, 4, 3, 2],
      previousStageName = null,
      playerStateBeforeBuild = null,
      gameStateBeforeBuild = null,
    } = initialGameState;
    this.energyRow = energyRow;
    this.dispenser = dispenser;
    this.cards = cards;
    this.players = players;
    this.energyRowSize = energyRowSize;
    this.cardToBeBuilt = cardToBeBuilt;
    this.cardToBeBuiltCost = cardToBeBuiltCost;
    this.visibleCardsLimits = visibleCardsLimits;
    this.previousStageName = previousStageName;
    this.playerStateBeforeBuild = playerStateBeforeBuild;
    this.gameStateBeforeBuild = gameStateBeforeBuild;
  }

  readonly energyRow: ReadonlyArray<EnergyType> = [];
  readonly dispenser: EnergyTypeDictionary = new EnergyTypeDictionary(13, 13, 13, 13, 0);
  readonly cards: ReadonlyArray<CardInfo> = [];
  readonly players: { [id: string]: PlayerState } = {};
  readonly energyRowSize: number = 6;
  readonly cardToBeBuilt: CardInfo | null = null;
  readonly cardToBeBuiltCost: EnergyTypeDictionary | null = null;
  readonly visibleCardsLimits: ReadonlyArray<number> = [0, 4, 3, 2];
  readonly previousStageName: string | null = null;
  readonly playerStateBeforeBuild: PlayerState | null = null;
  readonly gameStateBeforeBuild: GameState | null = null;

  cardsWithout(cardId: number): ReadonlyArray<CardInfo> {
    return this.cards.filter((c: CardInfo) => c.cardId !== cardId);
  }

  withCardRemovedFromTable(cardId: number): GameState {
    const cards = this.cardsWithout(cardId);
    return new GameS({ ...this, cards });
  }

  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: EnergyTypeDictionary): GameState {
    return new GameS({ ...this, cardToBeBuilt, cardToBeBuiltCost });
  }

  withCardsPutOnBottom(returnedCards: ReadonlyArray<CardInfo>): GameState {
    const cards = [...this.cards, ...returnedCards];
    return new GameS({ ...this, cards });
  }

  withCardToBeBuiltCleared(): GameState {
    const cards = this.cardToBeBuilt ? this.cardsWithout(this.cardToBeBuilt?.cardId) : this.cards;
    return new GameS({
      ...this,
      cards: cards,
      cardToBeBuilt: null,
      cardToBeBuiltCost: null,
    });
  }

  withEnergyRemovedFromCost(paidFor: EnergyType): GameState {
    if (!this.cardToBeBuiltCost) throw new Error("There is no card to pay for.");

    const reducedAmount = this.cardToBeBuiltCost?.get(paidFor) - 1;
    const cardToBeBuiltCost = this.cardToBeBuiltCost?.withAmountToPayWithEnergyTypeSetTo(paidFor, reducedAmount);

    return new GameS({ ...this, cardToBeBuiltCost });
  }

  withEnergyAddedToCost(paidFor: EnergyType): GameState {
    if (!this.cardToBeBuiltCost) throw new Error("There is no card to pay for.");

    const increasedAmount = this.cardToBeBuiltCost?.get(paidFor) + 1;
    const cardToBeBuiltCost = this.cardToBeBuiltCost?.withAmountToPayWithEnergyTypeSetTo(paidFor, increasedAmount);

    return new GameS({ ...this, cardToBeBuiltCost });
  }

  withPlayerAndGameStateSaved(ctx: GameContext): GameState {
    return new GameS({
      ...this,
      gameStateBeforeBuild: this,
      playerStateBeforeBuild: ctx.player?.get(),
      previousStageName: ctx.activePlayers?.[ctx.currentPlayer] ?? null,
    });
  }

  withShuffeledCards(ctx: GameContext): GameState {
    return new GameS({ ...this, cards: ctx.random?.Shuffle([...this.cards]) });
  }

  getPlayer(playerId: PlayerID): PlayerState | null {
    if (!Object.keys(this.players).includes(playerId)) return null;
    return this.players[playerId];
  }

  visibleCards(level: PilesCardLevel): ReadonlyArray<CardInfo> {
    return this.cards.slice(0, this.visibleCardsLimits[level]);
  }

  moveCard(from: PickerFunction<CardInfo>, into: PutterFunction<CardInfo>): GameState;
  moveCard(from: PickerFunction<CardInfo>, into: MultiPutterFunction<CardInfo>): GameState;
  moveCard(from: MultiPickerFunction<CardInfo>, into: MultiPutterFunction<CardInfo>): GameState;
  moveCard(picker: Function, putter: Function): GameState {
    if (isMultiPicker<CardInfo>(picker) && isMultiPutter<CardInfo>(putter)) {
      const [gAfterPick, pickedCards] = picker(this);
      const gAfterPut = putter(gAfterPick, pickedCards);
      return gAfterPut;
    } else if (isPicker<CardInfo>(picker) && isMultiPutter<CardInfo>(putter)) {
      const [gAfterPick, pickedCard] = picker(this);
      const gAfterPut = putter(gAfterPick, [pickedCard]);
      return gAfterPut;
    } else if (isPicker<CardInfo>(picker) && isPutter<CardInfo>(putter)) {
      const [gAfterPick, pickedCard] = picker(this);
      const gAfterPut = putter(gAfterPick, pickedCard);
      return gAfterPut;
    } else if (isMultiPicker<CardInfo>(picker) && isPutter<CardInfo>(putter)) {
      throw new Error("Cannot move cards due to wrong picker/putter setup");
    }
    throw new Error("Unknown args for picker/putter");
  }

  moveEnergy<T = EnergyType | EnergyTypeDictionary>(from: PickerFunction<T>, to: PutterFunction<T>): GameState {
    const [gAfterPick, pickedEnergy] = from(this);
    const gAfterPut = to(gAfterPick, pickedEnergy);
    return gAfterPut;
  }

  withUpdatedPlayer(playerId: PlayerID, playerState: PlayerState): GameState {
    const players = { ...this.players, [playerId]: playerState };
    return new GameS({ ...this, players });
  }
}

import { CardInfo } from "./cards/cardInfo";
import { EnergyType } from "./basicGameElements";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerState } from "./playerState";
import { Ctx, PlayerID } from "boardgame.io";
import { GameContext } from "./gameContext";

export type Picker<T> = (source: GameState) => [GameState, T];
export type Putter<T> = (destination: GameState, cards: T) => GameState;
export type MultiPicker<T> = (source: GameState) => [GameState, ReadonlyArray<T>];
export type MultiPutter<T> = (destination: GameState, cards: ReadonlyArray<T>) => GameState;

function isPicker<T>(x: Function): x is Picker<T> {
  if (x as Picker<T>) return true;
  return false;
}
function isMultiPicker<T>(x: Function): x is MultiPicker<T> {
  if (x as MultiPicker<T>) return true;
  return false;
}
function isPutter<T>(x: Function): x is Putter<T> {
  if (x as Putter<T>) return true;
  return false;
}
function isMultiPutter<T>(x: Function): x is MultiPutter<T> {
  if (x as MultiPutter<T>) return true;
  return false;
}

export type PilesCardLevel = 1 | 2 | 3;

export interface GameState {
  readonly energyRow: ReadonlyArray<EnergyType>;
  readonly cards: ReadonlyArray<CardInfo>;
  readonly players: { [id: string]: PlayerState };
  readonly visibleEnergyBallsLimit: number;
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

  energyWithIndexCanBeTakenFromEnergyRow(index: number): boolean;
  withEnergyRowWithout(index: number): [GameState, EnergyType];

  withPlayerAndGameStateSaved(ctx: Ctx): GameState;

  withEnergyRemovedFromCost(paidFor: EnergyType): GameState;
  withEnergyAddedToCost(changeTo: EnergyType): GameState;

  withShuffeledCards(ctx: GameContext): GameState;
  withShuffeledDispenser(ctx: GameContext): GameState;

  moveCard(from: Picker<CardInfo>, into: Putter<CardInfo>): GameState;
  moveCard(from: Picker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
  moveCard(from: MultiPicker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
  withUpdatedPlayer(playerId: string, playerStateAfter: PlayerState): GameState;
}

export interface GameStateData {
  readonly energyRow?: ReadonlyArray<EnergyType>;
  readonly cards?: ReadonlyArray<CardInfo>;
  readonly players?: { [id: string]: PlayerState };
  readonly visibleEnergyBallsLimit?: number;
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
      cards = [],
      players = {},
      visibleEnergyBallsLimit = 6,
      cardToBeBuilt = null,
      cardToBeBuiltCost = null,
      visibleCardsLimits = [0, 4, 3, 2],
      previousStageName = null,
      playerStateBeforeBuild = null,
      gameStateBeforeBuild = null,
    } = initialGameState;
    this.energyRow = energyRow;
    this.cards = cards;
    this.players = players;
    this.visibleEnergyBallsLimit = visibleEnergyBallsLimit;
    this.cardToBeBuilt = cardToBeBuilt;
    this.cardToBeBuiltCost = cardToBeBuiltCost;
    this.visibleCardsLimits = visibleCardsLimits;
    this.previousStageName = previousStageName;
    this.playerStateBeforeBuild = playerStateBeforeBuild;
    this.gameStateBeforeBuild = gameStateBeforeBuild;
  }

  readonly energyRow: ReadonlyArray<EnergyType> = [];
  readonly cards: ReadonlyArray<CardInfo> = [];
  readonly players: { [id: string]: PlayerState } = {};
  readonly visibleEnergyBallsLimit: number = 6;
  readonly cardToBeBuilt: CardInfo | null = null;
  readonly cardToBeBuiltCost: EnergyTypeDictionary | null = null;
  readonly visibleCardsLimits: ReadonlyArray<number> = [0, 4, 3, 2];
  readonly previousStageName: string | null = null;
  readonly playerStateBeforeBuild: PlayerState | null = null;
  readonly gameStateBeforeBuild: GameState | null = null;

  cardsWithout(cardId: number): ReadonlyArray<CardInfo> {
    return this.cards.filter((c: CardInfo) => c.cardId !== cardId);
  }

  energyWithIndexCanBeTakenFromEnergyRow(index: number): boolean {
    return index >= 0 && index < this.visibleEnergyBallsLimit;
  }

  private energyRowWithout(index: number): [ReadonlyArray<EnergyType>, EnergyType] {
    const energy = this.energyRow[index];
    const energyRow = this.energyRow.filter((e, idx) => idx !== index);
    return [energyRow, energy];
  }

  withCardRemovedFromTable(cardId: number): GameState {
    const cards = this.cardsWithout(cardId);
    return new GameS({ ...this, cards });
  }

  withEnergyRowWithout(index: number): [GameState, EnergyType] {
    const [energyRow, energy] = this.energyRowWithout(index);
    return [new GameS({ ...this, energyRow }), energy];
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

  withShuffeledDispenser(ctx: GameContext): GameState {
    return new GameS({
      ...this,
      energyRow: ctx.random?.Shuffle([...this.energyRow]),
    });
  }

  moveCard(from: Picker<CardInfo>, into: Putter<CardInfo>): GameState;
  moveCard(from: Picker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
  moveCard(from: MultiPicker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
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

  withUpdatedPlayer(playerId: PlayerID, playerState: PlayerState): GameState {
    const players = { ...this.players, [playerId]: playerState };
    return new GameS({ ...this, players });
  }
}

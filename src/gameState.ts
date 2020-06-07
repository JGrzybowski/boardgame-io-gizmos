import { CardInfo, CardLevel } from "./cards/cardInfo";
import { EnergyType } from "./energyType";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerState } from "./playerState";
import { Ctx, PlayerID } from "boardgame.io";
import { GameContext } from "./gameContext";
import Picker from "./pickers/picker";
import MultiPicker from "./pickers/multiPicker";
import Putter from "./putters/putter";
import MultiPutter from "./putters/multiPutter";
import { CardWithLevel } from "./cards/cardsCollection";

function isPicker<T>(x: Picker<T> | MultiPicker<T>): x is Picker<T> {
  return (x as Picker<T>).pick !== undefined;
}
function isMultiPicker<T>(x: Picker<T> | MultiPicker<T>): x is MultiPicker<T> {
  return (x as MultiPicker<T>).pickMultiple !== undefined;
}

function isPutter<T>(x: Putter<T> | MultiPutter<T>): x is Putter<T> {
  return (x as Putter<T>).put !== undefined;
}

function isMultiPutter<T>(x: Putter<T> | MultiPutter<T>): x is MultiPutter<T> {
  return (x as MultiPutter<T>).putMultiple !== undefined;
}

export type PilesCardLevel = 1 | 2 | 3;

export interface GameState {
  readonly energyRow: ReadonlyArray<EnergyType>;
  readonly dispenser: EnergyTypeDictionary;
  // readonly cards: ReadonlyArray<CardInfo>;
  readonly visibleCards: ReadonlyArray<CardInfo>;
  readonly pileCards: ReadonlyArray<CardInfo>;
  readonly players: { [id: string]: PlayerState };
  readonly energyRowSize: number;
  readonly cardToBeBuilt: CardInfo | null;
  readonly cardToBeBuiltCost: EnergyTypeDictionary | null;
  readonly visibleCardsLimits: ReadonlyArray<number>;

  readonly previousStageName: string | null;
  readonly gameStateBeforeBuild: GameState | null;

  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: EnergyTypeDictionary): GameState;

  withGameStateSaved(ctx: Ctx): GameState;

  withEnergyRemovedFromCost(paidFor: EnergyType): GameState;
  withEnergyAddedToCost(changeTo: EnergyType): GameState;

  withShuffeledCards(ctx: GameContext): GameState;

  pileCardsOfLevel(level: CardLevel): ReadonlyArray<CardInfo>;
  visibleCardsOfLevel(level?: CardLevel): ReadonlyArray<CardInfo>;

  moveCard(from: Picker<CardInfo>, into: Putter<CardInfo>): GameState;
  moveCard(from: Picker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
  moveCard(from: MultiPicker<CardInfo>, into: MultiPutter<CardInfo>): GameState;

  canMoveEnergy<T = EnergyType | EnergyTypeDictionary>(from: Picker<T>, to: Putter<T>): boolean;
  moveEnergy<T = EnergyType | EnergyTypeDictionary>(from: Picker<T>, to: Putter<T>): GameState;

  withUpdatedPlayer(playerId: string, playerStateAfter: PlayerState): GameState;
}

export interface GameStateData {
  readonly energyRow?: ReadonlyArray<EnergyType>;
  readonly dispenser?: EnergyTypeDictionary;
  readonly cards?: ReadonlyArray<CardInfo>;
  readonly visibleCards?: ReadonlyArray<CardInfo>;
  readonly pileCards?: ReadonlyArray<CardInfo>;
  readonly players?: { [id: string]: PlayerState };
  readonly energyRowSize?: number;
  readonly cardToBeBuilt?: CardInfo | null;
  readonly cardToBeBuiltCost?: EnergyTypeDictionary | null;
  readonly visibleCardsLimits?: ReadonlyArray<number>;
  readonly previousStageName?: string | null;
  readonly gameStateBeforeBuild?: GameState | null;
}

export class GameS implements GameState {
  constructor(initialGameState: GameStateData) {
    const {
      energyRow = [],
      dispenser = new EnergyTypeDictionary(13, 13, 13, 13, 0),
      // cards = [],
      visibleCards = [],
      pileCards = [],
      players = {},
      energyRowSize = 6,
      cardToBeBuilt = null,
      cardToBeBuiltCost = null,
      visibleCardsLimits = [0, 4, 3, 2],
      previousStageName = null,
      gameStateBeforeBuild = null,
    } = initialGameState;
    this.energyRow = energyRow;
    this.dispenser = dispenser;
    // this.cards = cards;
    this.visibleCards = visibleCards;
    this.pileCards = pileCards;
    this.players = players;
    this.energyRowSize = energyRowSize;
    this.cardToBeBuilt = cardToBeBuilt;
    this.cardToBeBuiltCost = cardToBeBuiltCost;
    this.visibleCardsLimits = visibleCardsLimits;
    this.previousStageName = previousStageName;
    this.gameStateBeforeBuild = gameStateBeforeBuild;
  }

  readonly energyRow: ReadonlyArray<EnergyType> = [];
  readonly dispenser: EnergyTypeDictionary = new EnergyTypeDictionary(13, 13, 13, 13, 0);
  // readonly cards: ReadonlyArray<CardInfo> = [];
  readonly visibleCards: ReadonlyArray<CardInfo> = [];
  readonly pileCards: ReadonlyArray<CardInfo> = [];
  readonly players: { [id: string]: PlayerState } = {};
  readonly energyRowSize: number = 6;
  readonly cardToBeBuilt: CardInfo | null = null;
  readonly cardToBeBuiltCost: EnergyTypeDictionary | null = null;
  readonly visibleCardsLimits: ReadonlyArray<number> = [0, 4, 3, 2];
  readonly previousStageName: string | null = null;
  readonly gameStateBeforeBuild: GameState | null = null;

  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: EnergyTypeDictionary): GameState {
    return new GameS({ ...this, cardToBeBuilt, cardToBeBuiltCost });
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

  withGameStateSaved(ctx: GameContext): GameState {
    return new GameS({
      ...this,
      gameStateBeforeBuild: this,
      previousStageName: ctx.activePlayers?.[ctx.currentPlayer] ?? null,
    });
  }

  withShuffeledCards(ctx: GameContext): GameState {
    return new GameS({ ...this, pileCards: ctx.random?.Shuffle([...this.pileCards]) });
  }

  pileCardsOfLevel(level: PilesCardLevel): ReadonlyArray<CardInfo> {
    if (level) return this.pileCards.filter(CardWithLevel(level));
    return this.visibleCardsOfLevel(1).concat(this.visibleCardsOfLevel(2)).concat(this.visibleCardsOfLevel(3));
  }

  visibleCardsOfLevel(level: PilesCardLevel): ReadonlyArray<CardInfo> {
    if (level) return this.visibleCards.filter(CardWithLevel(level));
    return this.visibleCardsOfLevel(1).concat(this.visibleCardsOfLevel(2)).concat(this.visibleCardsOfLevel(3));
  }

  moveCard(from: Picker<CardInfo>, into: Putter<CardInfo>): GameState;
  moveCard(from: Picker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
  moveCard(from: MultiPicker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
  moveCard(
    picker: Picker<CardInfo> | MultiPicker<CardInfo>,
    putter: Putter<CardInfo> | MultiPutter<CardInfo>
  ): GameState {
    if (isMultiPicker(picker) && isMultiPutter<CardInfo>(putter)) {
      if (!picker.canPickMultiple(this)) throw new Error("");
      const [gAfterPick, pickedCards] = picker.pickMultiple(this);

      if (!putter.canPutMultiple(gAfterPick, pickedCards)) throw new Error("");
      const gAfterPut = putter.putMultiple(gAfterPick, pickedCards);

      return gAfterPut;
    } else if (isPicker(picker) && isMultiPutter<CardInfo>(putter)) {
      if (!picker.canPick(this)) throw new Error("");
      const [gAfterPick, pickedCard] = picker.pick(this);

      if (!putter.canPutMultiple(gAfterPick, [pickedCard])) throw new Error("");
      const gAfterPut = putter.putMultiple(gAfterPick, [pickedCard]);

      return gAfterPut;
    } else if (isPicker(picker) && isPutter<CardInfo>(putter)) {
      if (!picker.canPick(this)) throw new Error("");
      const [gAfterPick, pickedCard] = picker.pick(this);

      if (!putter.canPut(gAfterPick, pickedCard)) throw new Error("");
      const gAfterPut = putter.put(gAfterPick, pickedCard);

      return gAfterPut;
    } else if (isMultiPicker<CardInfo>(picker) && isPutter<CardInfo>(putter)) {
      throw new Error("Cannot move cards due to wrong picker/putter setup");
    }
    throw new Error("Unknown args for picker/putter");
  }

  canMoveEnergy<T = EnergyType | EnergyTypeDictionary>(picker: Picker<T>, putter: Putter<T>): boolean {
    if (!picker.canPick(this)) return false;
    const [gAfterPick, pickedEnergy] = picker.pick(this);
    if (!putter.canPut(gAfterPick, pickedEnergy)) return false;
    return true;
  }

  moveEnergy<T = EnergyType | EnergyTypeDictionary>(picker: Picker<T>, putter: Putter<T>): GameState {
    if (!picker.canPick(this)) throw new Error();
    const [gAfterPick, pickedEnergy] = picker.pick(this);
    if (!putter.canPut(gAfterPick, pickedEnergy)) throw new Error();
    const gAfterPut = putter.put(gAfterPick, pickedEnergy);
    return gAfterPut;
  }

  withUpdatedPlayer(playerId: PlayerID, playerState: PlayerState): GameState {
    const players = { ...this.players, [playerId]: playerState };
    return new GameS({ ...this, players });
  }
}

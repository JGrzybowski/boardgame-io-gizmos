import { CardInfo, CardLevel } from "./cards/cardInfo";
import { EnergyType } from "./basicGameElements";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerState } from "./playerState";
import { Ctx, PlayerID } from "boardgame.io";
import { GameContext } from "./gameContext";
import Picker from "./pickers/picker";
import MultiPicker from "./pickers/multiPicker";
import Putter from "./putters/putter";
import MultiPutter from "./putters/multiPutter";

function isPicker<T>(x: Picker<T> | MultiPicker<T>): x is Picker<T> {
  if (x as Picker<T>) return true;
  return false;
}
function isMultiPicker<T>(x: Picker<T> | MultiPicker<T>): x is MultiPicker<T> {
  if (x as MultiPicker<T>) return true;
  return false;
}

function isPutter<T>(x: Putter<T> | MultiPutter<T>): x is Putter<T> {
  if (x as Putter<T>) return true;
  return false;
}
function isMultiPutter<T>(x: Putter<T> | MultiPutter<T>): x is MultiPutter<T> {
  if (x as MultiPutter<T>) return true;
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

  visibleCards(level: CardLevel): ReadonlyArray<CardInfo>;

  moveCard(from: Picker<CardInfo>, into: Putter<CardInfo>): GameState;
  moveCard(from: Picker<CardInfo>, into: MultiPutter<CardInfo>): GameState;
  moveCard(from: MultiPicker<CardInfo>, into: MultiPutter<CardInfo>): GameState;

  moveEnergy<T = EnergyType | EnergyTypeDictionary>(from: Picker<T>, to: Putter<T>): GameState;

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

  visibleCards(level: PilesCardLevel): ReadonlyArray<CardInfo> {
    return this.cards.slice(0, this.visibleCardsLimits[level]);
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

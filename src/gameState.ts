import { CardInfo } from "./cards/cardInfo";
import { EnergyType } from "./basicGameElements";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { PlayerState } from "./playerState";
import { Ctx, PlayerID } from "boardgame.io";
import { GameContext } from "./gameContext";

export type CardPicker<T> = (source: T) => [T, ReadonlyArray<CardInfo>];
export type CardPutter<T> = (destination: T, cards: ReadonlyArray<CardInfo>) => T;

export interface GameState {
  readonly dispenser: ReadonlyArray<EnergyType>;
  readonly cards: ReadonlyArray<CardInfo>;
  readonly players: { [id: string]: PlayerState };
  readonly visibleEnergyBallsLimit: number;
  readonly cardToBeBuilt: CardInfo | null;
  readonly cardToBeBuiltCost: EnergyTypeDictionary | null;
  readonly visibleCardsLimits: ReadonlyArray<number>;

  readonly previousStageName: string | null;
  readonly playerStateBeforeBuild: PlayerState | null;
  readonly gameStateBeforeBuild: GameState | null;

  findCardOnTheTable(cardId: number): CardInfo | null;
  withCardRemovedFromTable(cardId: number): GameState;
  withCardsPutOnBottom(cards: ReadonlyArray<CardInfo>): GameState;

  revealedCardsFromPile(researchLimit: number, cardLevel: 1 | 2 | 3): [GameState, ReadonlyArray<CardInfo>];

  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: EnergyTypeDictionary): GameState;
  withCardToBeBuiltCleared(): GameState;
  cardsWithout(cardId: number): ReadonlyArray<CardInfo>;

  energyWithIndexCanBeTakenFromEnergyRow(index: number): boolean;
  withDispenserWithout(index: number): [GameState, EnergyType];

  withPlayerAndGameStateSaved(ctx: Ctx): GameState;

  withEnergyRemovedFromCost(paidFor: EnergyType): GameState;
  withEnergyAddedToCost(changeTo: EnergyType): GameState;

  withShuffeledCards(ctx: GameContext): GameState;
  withShuffeledDispenser(ctx: GameContext): GameState;

  moveCard(from: CardPicker<GameState>, into: CardPutter<GameState>): GameState;
  withUpdatedPlayer(playerId: string, playerStateAfter: PlayerState): GameState;
}

export interface GameStateData {
  readonly dispenser?: ReadonlyArray<EnergyType>;
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
      dispenser = [],
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
    this.dispenser = dispenser;
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

  readonly dispenser: ReadonlyArray<EnergyType> = [];
  readonly cards: ReadonlyArray<CardInfo> = [];
  readonly players: { [id: string]: PlayerState } = {};
  readonly visibleEnergyBallsLimit: number = 6;
  readonly cardToBeBuilt: CardInfo | null = null;
  readonly cardToBeBuiltCost: EnergyTypeDictionary | null = null;
  readonly visibleCardsLimits: ReadonlyArray<number> = [0, 4, 3, 2];
  readonly previousStageName: string | null = null;
  readonly playerStateBeforeBuild: PlayerState | null = null;
  readonly gameStateBeforeBuild: GameState | null = null;

  findCardOnTheTable(cardId: number): CardInfo | null {
    const card = this.cards.find((c) => c.cardId === cardId);
    return !card ? null : card;
  }

  cardsWithout(cardId: number): ReadonlyArray<CardInfo> {
    return this.cards.filter((c: CardInfo) => c.cardId !== cardId);
  }

  energyWithIndexCanBeTakenFromEnergyRow(index: number): boolean {
    return index >= 0 && index < this.visibleEnergyBallsLimit;
  }

  private dispenserWithout(index: number): [ReadonlyArray<EnergyType>, EnergyType] {
    const energy = this.dispenser[index];
    const dispenser = this.dispenser.filter((e, idx) => idx !== index);
    return [dispenser, energy];
  }

  withCardRemovedFromTable(cardId: number): GameState {
    const cards = this.cardsWithout(cardId);
    return new GameS({ ...this, cards });
  }

  withDispenserWithout(index: number): [GameState, EnergyType] {
    const [dispenser, energy] = this.dispenserWithout(index);
    return [new GameS({ ...this, dispenser }), energy];
  }

  withCardToBeBuilt(cardToBeBuilt: CardInfo, cardToBeBuiltCost: EnergyTypeDictionary): GameState {
    return new GameS({ ...this, cardToBeBuilt, cardToBeBuiltCost });
  }

  withCardsPutOnBottom(returnedCards: ReadonlyArray<CardInfo>): GameState {
    const cards = [...this.cards, ...returnedCards];
    return new GameS({ ...this, cards });
  }

  revealedCardsFromPile(researchLimit: number, cardLevel: 1 | 2 | 3): [GameState, ReadonlyArray<CardInfo>] {
    const revealedCards: ReadonlyArray<CardInfo> = this.cards
      .filter((c) => c.level === cardLevel)
      .slice(this.visibleCardsLimits[cardLevel], this.visibleCardsLimits[cardLevel] + researchLimit);
    const revealedIds = revealedCards.map((c) => c.cardId);
    const cards: ReadonlyArray<CardInfo> = this.cards.filter((c) => !revealedIds.find((id) => c.cardId === id));
    return [new GameS({ ...this, cards }), revealedCards];
  }

  withCardToBeBuiltCleared(): GameState {
    const cards = this.cardToBeBuilt ? this.cardsWithout(this.cardToBeBuilt?.cardId) : this.cards;
    return new GameS({ ...this, cards: cards, cardToBeBuilt: null, cardToBeBuiltCost: null });
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
    return new GameS({ ...this, dispenser: ctx.random?.Shuffle([...this.dispenser]) });
  }

  moveCard(picker: CardPicker<GameState>, putter: CardPutter<GameState>): GameState {
    const [gAfterPick, pickedCards] = picker(this);
    const gAfterPut = putter(gAfterPick, pickedCards);
    return gAfterPut;
  }

  withUpdatedPlayer(playerId: PlayerID, playerState: PlayerState): GameState {
    const players = { ...this.players, [playerId]: playerState };
    return new GameS({ ...this, players });
  }
}

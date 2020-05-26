import { GameState } from "../gameState";
import { CardInfo } from "../cards/cardInfo";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameContext } from "../gameContext";
import { PlayerState } from "../playerState";
import { PlayerMove } from "./playerMove";
import { paymentStage } from "../stages/paymentStage";
import { EnergyTypeDictionary } from "../cards/energyTypeDictionary";
import { From } from "../From";
import { To } from "../To";

function buildFromCommon(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const selectedCard: CardInfo | null = G.findCardOnTheTable(cardId);
  if (!selectedCard) return INVALID_MOVE;
  if (G.cardToBeBuilt || G.cardToBeBuiltCost) return INVALID_MOVE;

  const newGameState = G.withPlayerAndGameStateSaved(ctx).withCardToBeBuilt(
    selectedCard,
    EnergyTypeDictionary.fromTypeAndAmount(selectedCard?.color, selectedCard?.cost)
  );

  ctx.events?.setStage?.(paymentStage.name);
  return newGameState;
}

function buildFromArchive(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const playerState: PlayerState = G.players[ctx.currentPlayer];
  const selectedCard: CardInfo | null = playerState.findCardInTheArchive(cardId);
  if (!selectedCard) return INVALID_MOVE;

  const newPlayerState = playerState.withRemovedCardFromArchive(cardId);
  const newGameState = G.withPlayerAndGameStateSaved(ctx)
    .withCardToBeBuilt(selectedCard, EnergyTypeDictionary.fromTypeAndAmount(selectedCard?.color, selectedCard?.cost))
    .withUpdatedPlayer(ctx.currentPlayer, newPlayerState);

  ctx.events?.setStage?.(paymentStage.name);
  return newGameState;
}

function buildFromResearched(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  const playerState: PlayerState = G.players[ctx.currentPlayer];
  const selectedCard: CardInfo | null = playerState.findCardInTheResearched(cardId);
  if (!selectedCard) return INVALID_MOVE;

  const withCardsMoved = G.moveCard(From.PlayerResearched(ctx.currentPlayer, cardId), To.CardToBuild()).moveCard(
    From.PlayerResearched(ctx.currentPlayer),
    To.BottomOfPile()
  );

  if (!withCardsMoved.cardToBeBuilt) return INVALID_MOVE;

  const newGameState = withCardsMoved.withCardToBeBuilt(
    withCardsMoved.cardToBeBuilt,
    EnergyTypeDictionary.fromTypeAndAmount(withCardsMoved.cardToBeBuilt.color, withCardsMoved.cardToBeBuilt?.cost)
  );

  ctx.events?.setStage?.(paymentStage.name);
  return newGameState;
}

export const buildFromCommonAction: PlayerMove = {
  move: buildFromCommon,
  undoable: true,
  client: false,
};

export const buildFromArchiveAction: PlayerMove = {
  move: buildFromArchive,
  undoable: true,
  client: false,
};

export const buildFromResearchedAction: PlayerMove = {
  move: buildFromResearched,
  undoable: true,
  client: false,
};

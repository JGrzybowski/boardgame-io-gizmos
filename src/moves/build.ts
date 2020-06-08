import { GameState } from "../gameState";
import { CardInfo } from "../cards/cardInfo";
import { INVALID_MOVE } from "boardgame.io/core";
import { GameContext } from "../gameContext";
import { PlayerState } from "../playerState";
import { PlayerMove } from "./playerMove";
import { paymentStage } from "../stages/paymentStage";
import { From } from "../pickers/From";
import { To } from "../putters/To";
import { CardWithId, GetFirstOrNull } from "../cards/cardsCollection";

function buildFromCommon(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  if (G.cardToBeBuilt) return INVALID_MOVE;
  const selectedCard = GetFirstOrNull(G.visibleCards, CardWithId(cardId));
  if (!selectedCard) return INVALID_MOVE;
  if (G.cardToBeBuilt || G.cardToBeBuiltCost) return INVALID_MOVE;

  const newGameState = G
    // save state before building
    .withGameStateSaved(ctx)
    // move card from the table to the build zone
    .moveCard(From.Table(cardId), To.CardToBuild());

  ctx.events?.setStage?.(paymentStage.name);
  return newGameState;
}

function buildFromArchive(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  if (G.cardToBeBuilt) return INVALID_MOVE;
  if (!ctx.playerID) return INVALID_MOVE;
  const playerId = ctx.playerID;
  const playerState: PlayerState = G.players[playerId];

  const selectedCard: CardInfo | null = playerState.findCardInTheArchive(cardId);
  if (!selectedCard) return INVALID_MOVE;

  const newGameState = G
    // save state before building
    .withGameStateSaved(ctx)
    // move card from the archive to the build zone
    .moveCard(From.PlayerArchive(playerId, cardId), To.CardToBuild());

  ctx.events?.setStage?.(paymentStage.name);
  return newGameState;
}

function buildFromResearched(G: GameState, ctx: GameContext, cardId: number): GameState | string {
  if (G.cardToBeBuilt) return INVALID_MOVE;
  if (!ctx.playerID) return INVALID_MOVE;
  const playerId = ctx.playerID;
  const playerState: PlayerState = G.players[playerId];

  const selectedCard: CardInfo | null = GetFirstOrNull(playerState.researched, CardWithId(cardId));
  if (!selectedCard) return INVALID_MOVE;

  const newGameState = G
    // save state before building
    .withGameStateSaved(ctx)
    // move card from the researched to the build zone
    .moveCard(From.PlayerResearched(playerId, cardId), To.CardToBuild())
    // move the other cards from the researched to the bottom of the pile
    .moveCard(From.PlayerResearched(playerId), To.BottomOfPile());

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

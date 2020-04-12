import {GameState} from "../gameState";
import {GameContext} from "../gameContext";
import {PlayerState} from "../playerState";
import {INVALID_MOVE} from "boardgame.io/core";
import {CardLevel} from "../cards/card";
import {PlayerMove} from "./playerMove";
import {researchStage} from "../stages/gameStages";

function researchMove(G: GameState, ctx: GameContext, cardLevel: CardLevel): GameState | string{
    const playerState: PlayerState = ctx.player?.get();
    if (!playerState.canResearch()) return INVALID_MOVE;
    if (cardLevel === 0) return INVALID_MOVE;

    //Load X cards (up to limit) from pile
    const [newGameState, revealedCards] = G.revealedCardsFromPile(playerState.researchLimit, cardLevel);
    if (revealedCards.length === 0) return INVALID_MOVE;

    //Show the cards to active player
    const newPlayerState = playerState.withCardsAddedToResearched(revealedCards);

    ctx.player?.set(newPlayerState);
    ctx.events?.endStage?.(researchStage.name);
    return newGameState;
}

export const researchAction: PlayerMove = {
    move: researchMove,
    undoable: false,
    client: false
};
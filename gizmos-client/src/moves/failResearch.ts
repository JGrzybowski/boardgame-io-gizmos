import {GameState} from "../gameState";
import {GameContext} from "../gameContext";
import {PlayerState} from "../playerState";
import {activationStage} from "../stages/gameStages";
import {PlayerMove} from "./playerMove";

function failResearchMove (G: GameState, ctx: GameContext): GameState {
    const playerState: PlayerState = ctx.player?.get();

    // move revealed cards to the bottom of deck from revealed cards
    const newGameState = G.withCardsPutOnBottom(playerState.researched);
    const newPlayerState: PlayerState = playerState.withResearchedCleared();

    ctx.player?.set(newPlayerState);
    ctx.events?.endStage?.(activationStage.name);
    return newGameState;
}

export const failResearchAction: PlayerMove = {
    move: failResearchMove,
    client: false,
    undoable: false
};
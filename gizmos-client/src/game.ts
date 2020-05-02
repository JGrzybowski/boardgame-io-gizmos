import { CardInfo } from "./cards/cardInfo";
import { PluginPlayer } from "boardgame.io/plugins";
import { PlayerState } from "./playerState";
import { GameState, InitialGameState } from "./gameState";
import { GameContext } from "./gameContext";
import { Game } from "boardgame.io";
import { actionStage } from "./stages/actionStage";
import { activationStage } from "./stages/activationStage";
import { paymentStage } from "./stages/paymentStage";
import { researchStage } from "./stages/researchStage";

function SomeoneHas16Machines(ctx: GameContext): boolean {
  return ctx.player?.get().machines.length === 16;
}

function SomeoneHas4MachinesOf_III_Level(ctx: GameContext): boolean {
  return ctx.player?.get().machines.filter((c: CardInfo) => c.level === 3).length === 4;
}

const Gizmos: Game<GameState, GameContext> = {
  name: "gizmos",

  setup: () => ({
    ...InitialGameState,
    playerSetup: (playerId: string): PlayerState => new PlayerState(playerId),
    plugins: [PluginPlayer],
  }),

  turn: {
    stages: {
      actionStage,
      paymentStage,
      researchStage,
      activationStage,
    },
  },

  endIf: (G: GameState, ctx: GameContext) => {
    if (SomeoneHas16Machines(ctx) || SomeoneHas4MachinesOf_III_Level(ctx)) {
      // TODO count victory points
      // const winnerIndex = G.victoryPoints.indexOf(Math.max(...arr));
      return { winner: 0 };
    }
  },
};

export default Gizmos;

import { Card } from "./cards/card";
import { PluginPlayer } from "boardgame.io/plugins";
import { PlayerState } from "./playerState";
import { GameState, InitialGameState } from "./gameState";
import { GameContext } from "./gameContext";
import { GameConfig } from "boardgame.io";
import { actionStage, activationStage, paymentStage, researchStage } from "./stages/gameStages";

function SomeoneHas16Machines(ctx: GameContext): boolean {
  return ctx.player?.get().machines.length === 16;
}

function SomeoneHas4MachinesOf_III_Level(ctx: GameContext): boolean {
  return ctx.player?.get().machines.filter((c: Card) => c.level === 3).length === 4;
}

const Gizmos: GameConfig = {
  name: "gizmos",

  setup: () => ({
    ...InitialGameState,
    playerSetup: (playerId: string): PlayerState => new PlayerState(playerId),
    plugins: [PluginPlayer]
  }),

  turn: {
    stages: {
      actionStage,
      paymentStage,
      researchStage,
      activationStage,
    }
  },

  endIf: (G: GameState, ctx: GameContext) => {
    if (SomeoneHas16Machines(ctx) || SomeoneHas4MachinesOf_III_Level(ctx)) {
      // TODO count victory points
      // const winnerIndex = G.victoryPoints.indexOf(Math.max(...arr));
      return { winner: 0 };
    }
  }
};

export default Gizmos;

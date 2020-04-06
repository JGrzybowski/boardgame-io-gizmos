import { Card } from "./cards/card";
import { PluginPlayer } from "boardgame.io/plugins";
import { PlayerState } from "./playerState";
import { GameState, InitialGameState } from "./gameState";
import { GameContext } from "./gameContext";
import { archiveAction } from "./moves/archive";
import { pickAction } from "./moves/pick";
import { buildFromArchiveAction, buildFromCommonAction } from "./moves/build";
import { activateCard } from "./moves/activateCard";
import { INVALID_MOVE } from "boardgame.io/dist/types/packages/core";
import {Ctx, GameConfig} from "boardgame.io";

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
    playerSetup: (playerId: string) => new PlayerState(playerId),
    plugins: [PluginPlayer]
  }),

  turn: {
    stages: {
      preActionStage: { moves: { activateCard } },
      actionStage: {
        moves: {
          archiveAction,
          pickAction,

          buildFromArchiveAction,
          buildFromCommonAction,

          research: {
            move: (G: GameState, ctx: GameContext, cardId: number): GameState | string => {
              return INVALID_MOVE;
            },
            undoable: false
          }
        }
      },
      postActionStage: { moves: { activateCard } }
    }
  },

  endIf: (G: GameState, ctx: GameContext) => {
    if (SomeoneHas16Machines(ctx) || SomeoneHas4MachinesOf_III_Level(ctx)) {
      // TODO count victory points
      // const winerIndex = G.victoryPoints.indexOf(Math.max(...arr));
      return { winner: 0 };
    }
  }
};

export default Gizmos;

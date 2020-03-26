import { Card } from "./cards/card";
import { PluginPlayer } from "boardgame.io/dist/esm/plugins";
import { PlayerState } from "./playerState";
import { GameState, InitialGameState } from "./gameState";
import { GameContext } from "./gameContext";
import { archive } from "./moves/archive";
import { pick } from "./moves/pick";
import { buildFromArchive, buildFromCommon } from "./moves/build";

function SomeoneHas16Machines(ctx: GameContext) {
  return ctx.player.get().machines.length == 16;
}

function SomeoneHas4MachinesOf_III_Level(ctx: GameContext) {
  return (
    ctx.player.get().machines.filter((c: Card) => c.level === 3).length === 4
  );
}

const Gizmos = {
  name: "gizmos",

  setup: () => ({
    ...InitialGameState,
    playerSetup: (playerID: unknown) => new PlayerState(playerID),
    plugins: [PluginPlayer]
  }),

  moves: {
    archive,
    pick,

    buildFromArchive,
    buildFromCommon,

    research(G: GameState, ctx: GameContext) {}
  },

  turn: {
    moveLimit: 1
  },

  endIf: (G: GameState, ctx: GameContext) => {
    if (SomeoneHas16Machines(ctx) || SomeoneHas4MachinesOf_III_Level(ctx)) {
      //TODO count victory points
      //const winerIndex = G.victoryPoints.indexOf(Math.max(...arr));
      return { winner: 0 };
    }
  }
};

export default Gizmos;

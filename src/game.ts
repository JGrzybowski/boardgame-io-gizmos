import { CardInfo } from "./cards/cardInfo";
import { PluginPlayer } from "boardgame.io/plugins";
import { PlayerState } from "./playerState";
import { GameState, GameS } from "./gameState";
import { GameContext } from "./gameContext";
import { Game } from "boardgame.io";
import { actionStage } from "./stages/actionStage";
import { activationStage } from "./stages/activationStage";
import { paymentStage } from "./stages/paymentStage";
import { researchStage } from "./stages/researchStage";
import { initialDispenser } from "./basicGameElements";
import { CardsList } from "./cards/cardsList";

function SomeoneHas16Machines(ctx: GameContext): boolean {
  return ctx.player?.get().machines.length === 16;
}

function SomeoneHas4MachinesOf_III_Level(ctx: GameContext): boolean {
  return ctx.player?.get().machines.filter((c: CardInfo) => c.level === 3).length === 4;
}

const InitialGameState: GameState = new GameS({
  energyRow: initialDispenser,
  cards: CardsList,
  players: { "0": new PlayerState({ playerId: "0" }) },

  visibleEnergyBallsLimit: 6,
  visibleCardsLimits: [0, 4, 3, 2],

  cardToBeBuilt: null,
  cardToBeBuiltCost: null,

  previousStageName: null,
  playerStateBeforeBuild: null,
  gameStateBeforeBuild: null,
});

const Gizmos: Game<GameState, GameContext> = {
  name: "gizmos",

  setup: (ctx) => {
    const G = InitialGameState.withShuffeledCards(ctx);
    ctx.events?.setStage?.(actionStage.name);

    return G;
  },

  plugins: [PluginPlayer({ setup: (playerId) => PlayerState.WithId(playerId) })],

  turn: {
    onBegin: (G, ctx) => {
      ctx.events?.setStage?.(actionStage.name);
      return G;
    },
    stages: {
      [actionStage.name]: actionStage,
      [paymentStage.name]: paymentStage,
      [researchStage.name]: researchStage,
      [activationStage.name]: activationStage,
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

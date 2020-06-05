import { PluginPlayer } from "boardgame.io/plugins";
import { PlayerState } from "./playerState";
import { GameState, GameS } from "./gameState";
import { GameContext } from "./gameContext";
import { Game, PlayerID } from "boardgame.io";
import { actionStage } from "./stages/actionStage";
import { activationStage } from "./stages/activationStage";
import { paymentStage } from "./stages/paymentStage";
import { researchStage } from "./stages/researchStage";
import { CardsList } from "./cards/cardsList";
import { EnergyTypeDictionary } from "./cards/energyTypeDictionary";
import { From } from "./pickers/From";
import { To } from "./putters/To";
import { RandomIndex, CardWithLevel } from "./cards/cardsCollection";

function SomeoneHas16Machines(G: GameState): boolean {
  return Object.keys(G.players).some((playerId: PlayerID) => G.players[playerId].machines.length === 16);
}

function SomeoneHas4MachinesOfThirdLevel(G: GameState): boolean {
  return Object.keys(G.players).some(
    (playerId: PlayerID) => G.players[playerId].machines.filter(CardWithLevel(3)).length === 4
  );
}

export function* range(from: number, to: number): Generator<number> {
  while (from !== to) yield from++;
}

const InitialGameState: GameState = new GameS({
  energyRow: [],
  dispenser: new EnergyTypeDictionary(13, 13, 13, 13, 0),

  cards: CardsList,
  players: { "0": new PlayerState({ playerId: "0" }) },

  energyRowSize: 6,
  visibleCardsLimits: [0, 4, 3, 2],
});

const Gizmos: Game<GameState, GameContext> = {
  name: "gizmos",

  setup: (ctx) => {
    const G = [...range(0, InitialGameState.energyRowSize - 1)].reduce(
      (g: GameState) => g.moveEnergy(From.Dispenser(RandomIndex(ctx)), To.EnergyRow()),
      InitialGameState.withShuffeledCards(ctx)
    );
    ctx.events?.setStage?.(actionStage.name);
    return G;
  },

  plugins: [PluginPlayer({ setup: (playerId) => PlayerState.WithId(playerId) })],

  turn: {
    onBegin: (G, ctx): GameState => {
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
    if (SomeoneHas16Machines(G) || SomeoneHas4MachinesOfThirdLevel(G)) {
      // TODO count victory points
      // const winnerIndex = G.victoryPoints.indexOf(Math.max(...arr));
      return { winner: 0 };
    }
  },
};

export default Gizmos;

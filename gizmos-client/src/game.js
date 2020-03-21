import { Level_I_cards, Level_II_cards, Level_III_cards, InitialCard } from '../../card.js';

function SomeoneHas16Machines(G) {
    //TODO check end game condition
    return false;
}

function SomeoneHas4MachinesOf_III_Level(G) {
    //TODO check end game condition
    return false;
}

const playersCount = 2;
const initialEnergyStorageCapacity = 5;
const initialArchiveLimit = 1;
const initialResearchLimit = 3;

const Gizmos = {
    name: "gizmos",

    setup: () => ({
        //R - Red, B - Black, U - Blue, Y - Yellow
        dispenser: Array(52)
            .fill("R", 0, 14)
            .fill("B", 13, 27)
            .fill("U", 26, 40)
            .fill("Y", 39, 52),
        level_I_cards = Level_I_cards,
        level_II_cards = Level_II_cards,
        level_III_cards = Level_III_cards,
        victoryPoints: Array(playersCount).fill(0),
        energyStorages: Array(playersCount).fill(
            Array(initialEnergyStorageCapacity)
        ),
        archivesLimit: Array(playersCount).fill(Array(initialArchiveLimit)),
        searchLimits: Array(playersCount).fill(initialResearchLimit),
        machines: Array(playersCount).fill(Array(1).fill(InitialCard())),
        archives: Array(playersCount).fill(Array(0))
    }),

    moves: {
        archive(G, ctx, id) {

        },

        pick(G, ctx, id) {},

        build(G, ctx, id) {},

        research(G, ctx, id) {}
    },

    turn: {
        moveLimit: 1
    },

    endIf: (G, ctx) => {
        if (SomeoneHas16Machines(G) || SomeoneHas4MachinesOf_III_Level(G)) {
            const winerIndex = G.victoryPoints.indexOf(Math.max(...arr));
            return { winner: winerIndex };
        }
    }
};

export default Gizmos;
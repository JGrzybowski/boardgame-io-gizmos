import { CardsList, InitialCard } from '../../card.js';

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

const visibleEnergyBallsLimit = 6;

const Gizmos = {
    name: "gizmos",

    setup: () => ({
        //R - Red, B - Black, U - Blue, Y - Yellow
        dispenser: Array(52)
            .fill("R", 0, 14)
            .fill("B", 13, 27)
            .fill("U", 26, 40)
            .fill("Y", 39, 52),
        cards = CardsList,

        playerSetup: (playerID) => ({
            playerId: playerID,
            victoryPoints: 0,

            energyStorage: Array(0),
            archivesLimit: Array(0),

            energyStorageCapacity = initialEnergyStorageCapacity,
            archiveLimit = initialArchiveLimit,
            researchLimit = initialResearchLimit,

            machines: Array(1).fill(InitialCard()),
            archive: Array(0)
        }),

        plugins: [PluginPlayer],
    }),

    moves: {
        archive(G, ctx, cardId) {
            const playerState = ctx.player.get();
            if (playerState.archive.length < playerState.archiveLimit) {
                let cards = [...G.cards]
                const selectedCard = cards.find((c) => c.cardId == cardId);

                if (typeof selectedCard === 'undefined')
                    return;

                // add card to player's archive
                let archive = [...playerState.archive];
                archive.push(selectedCard);
                ctx.player.set({...playerState, archive });

                // remove card from common area
                cards = cards.filter((c) => c.cardId != cardId);
                return {...G, cards };
            }
        },

        pick(G, ctx, energyIndex) {
            if (energyIndex < 0 || energyIndex > visibleEnergyBallsLimit)
                return;

            const playerState = ctx.player.get();
            if (playerState.energyStorage.length >= playerState.energyStorageCapacity)
                return;

            let dispenser = [...G.dispenser];
            let energy = dispenser[energy];

            // add energy to player's storage
            let energyStorage = [...playerState.energyStorage];
            energyStorage.push(energy);
            ctx.player.set({...playerState, energyStorage })

            // remove energy from dispenser
            dispenser = dispenser.filter((e, i) => i != energyIndex);
            return {...G, dispenser };
        },

        buildFromCommon(G, ctx, cardId, paidEnergy) {
            const playerState = ctx.player.get();
            const selectedCard = cards.find((c) => c.cardId == cardId)
            if (typeof selectedCard === 'undefined')
                return;

            let energyStorage = [...playerState.energyStorage];

            // declared energy can pay
            let costColors = selectedCard.color.toCharArray();
            let amountToPay = selectedCard.cost;
            for (let energy in costColors) {
                if (payment.hasOwnProperty(energy))
                    amountToPay -= payment[energy];
            }
            if (amountToPay != 0)
                return;

            // add card to player's machines
            let removeOneEnergy = function(storage, energy) {
                let i = storage.indexOf(energy);
                return storage.slice(0, i) + storage.slice(i + 1, storage.length);
            }
            energyStorage = energyStorage.reduce(removeOneEnergy, energyStorage);

            // add card to player's machines
            let machines = [...playerState.archive];
            machines.push(selectedCard);
            ctx.player.set({...playerState, machines, energyStorage });

            // remove card from common area
            cards = cards.filterzc
            return {...G, cards };
        },

        buildFromArchive(G, ctx, cardId, paidEnergy) {
            const playerState = ctx.player.get();
            const selectedCard = [...playerState.archive.find((c) => c.cardId == cardId)]
            if (typeof selectedCard === 'undefined') return;

            let energyStorage = [...playerState.energyStorage];

            // player has declared energy
            let countOcurrences = function(counters, energy) {
                if (!counters[energy]) {
                    counters[energy] = 1;
                } else {
                    counters[energy] = counters[energy] + 1;
                }
                return counters;
            }

            let playerEnergy = energyStorage.reduce(countOcurrences, {});
            let payment = paidEnergy.reduce(countOcurrences, {});

            let playerHasDeclaredEnergy = true;
            for (let energy in payment) {
                playerHasDeclaredEnergy = playerHasDeclaredEnergy &&
                    payment.hasOwnProperty(energy) &&
                    playerEnergy.hasOwnProperty(energy) &&
                    (payment[energy] <= playerEnergy[energyEnergy]);
            }

            if (!playerHasDeclaredEnergy) return;

            // declared energy can pay
            let costColors = selectedCard.color.toCharArray();
            let amountToPay = selectedCard.cost;
            for (let energy in costColors) {
                if (payment.hasOwnProperty(energy))
                    amountToPay -= payment[energy];
            }
            if (amountToPay != 0)
                return;

            // add card to player's machines
            let removeOneEnergy = function(storage, energy) {
                let i = storage.indexOf(energy);
                return storage.slice(0, i) + storage.slice(i + 1, storage.length);
            }
            energyStorage = energyStorage.reduce(removeOneEnergy, energyStorage);

            let machines = [...playerState.machines];
            machines.push(selectedCard);

            let archive = [...playerState.archive];
            archive = archive.filter((c) => c.cardId != cardId);

            ctx.player.set({...playerState, machines, archive, energyStorage });

            return {...G };
        },


        research(G, ctx, id) {

        }
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
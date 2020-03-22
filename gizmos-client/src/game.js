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
        cards: CardsList(),

        playerSetup: (playerID) => ({
            playerId: playerID,
            victoryPoints: 0,

            energyStorage: Array(0),
            archivesLimit: Array(0),

            energyStorageCapacity: initialEnergyStorageCapacity,
            archiveLimit: initialArchiveLimit,
            researchLimit: initialResearchLimit,

            machines: Array(1).fill(InitialCard()),
            archive: Array(0)
        }),

        plugins: [PluginPlayer] // FIXME: no import, no declaration
    }),

    moves: {
        archive(G, ctx, cardId) {
            const playerState = ctx.player.get();
            if (playerState.archive.length < playerState.archiveLimit) {
                let cards = [...G.cards];
                const selectedCard = cards.find((c) => c.cardId === cardId);

                if (!selectedCard)
                    return;

                // add card to player's archive
                let archive = [
                    ...playerState.archive,
                    selectedCard
                ];

                ctx.player.set({...playerState, archive });

                // remove card from common area
                cards = cards.filter((c) => c.cardId !== cardId);
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
            const energy = dispenser[energy]; // FIXME: no access to energy, will throw reference error

            // add energy to player's storage
            const energyStorage = [
                ...playerState.energyStorage,
                energy
            ];

            ctx.player.set({...playerState, energyStorage });

            // remove energy from dispenser
            dispenser = dispenser.filter((e, i) => i !== energyIndex);
            return {...G, dispenser };
        },

        buildFromCommon(G, ctx, cardId, paidEnergy) {
            const playerState = ctx.player.get();
            const selectedCard = cards.find((c) => c.cardId === cardId);  // FIXME: no access to cards, will throw reference error
            if (!selectedCard)
                return;

            let energyStorage = [...playerState.energyStorage];

            // declared energy can pay
            const costColors = selectedCard.color.toCharArray(); // FIXME, why toCharArray then for..in
            let amountToPay = selectedCard.cost;
            for (let energy in costColors) {
                if (payment.hasOwnProperty(energy)) // FIXME: no access to payment
                    amountToPay -= payment[energy];
            }

            if (amountToPay !== 0)
                return;

            // add card to player's machines
            const removeOneEnergy = (storage, energy) => {
                return storage.filter(e => e !== energy);
            };

            energyStorage = energyStorage.reduce(removeOneEnergy, energyStorage);

            // add card to player's machines
            let machines = [
                ...playerState.archive,
                selectedCard
            ];

            ctx.player.set({...playerState, machines, energyStorage });

            // remove card from common area
            cards = cards.filterzc // FIXME: wtf, no access to cards
            return {...G, cards };
        },

        buildFromArchive(G, ctx, cardId, paidEnergy) {
            const playerState = ctx.player.get();
            const selectedCard = playerState.archive.filter(c => c.cardId === cardId);

            if (!selectedCard)
                return;

            let energyStorage = [...playerState.energyStorage];

            // player has declared energy
            const countOcurrences = (counters, energy) => {
                if (!counters[energy]) {
                    return counters[energy] = 1;
                }

                return counters[energy] = counters[energy] + 1;
            };

            let playerEnergy = energyStorage.reduce(countOcurrences, {});
            let payment = paidEnergy.reduce(countOcurrences, {});

            let playerHasDeclaredEnergy = true;
            for (let energy in payment) { // POTENTIAL ERROR
                playerHasDeclaredEnergy = playerHasDeclaredEnergy &&
                    payment.hasOwnProperty(energy) &&
                    playerEnergy.hasOwnProperty(energy) &&
                    (payment[energy] <= playerEnergy[energyEnergy]); // FIXME: no access to energyEnergy
            }

            if (!playerHasDeclaredEnergy)
                return;

            // declared energy can pay
            let costColors = selectedCard.color.toCharArray(); // FIXME why toCharArray and for..in?
            let amountToPay = selectedCard.cost;
            for (let energy in costColors) { // TODO: Using TS will reduce hasOwnProperty
                if (payment.hasOwnProperty(energy))
                    amountToPay -= payment[energy];
            }

            if (amountToPay !== 0)
                return;

            // add card to player's machines
            // FIXME: Duplication
            const removeOneEnergy = (storage, energy) => {
                let i = storage.indexOf(energy);
                return storage.slice(0, i) + storage.slice(i + 1, storage.length);
            };

            energyStorage = energyStorage.reduce(removeOneEnergy, energyStorage);

            let machines = [
                ...playerState.machines,
                selectedCard
            ];

            let archive = [...playerState.archive];
            archive = archive.filter((c) => c.cardId !== cardId);

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
            const winnerIndex = G.victoryPoints.indexOf(Math.max(...arr)); // FIXME: no access to arr
            return { winner: winnerIndex };
        }
    }
};

export default Gizmos;

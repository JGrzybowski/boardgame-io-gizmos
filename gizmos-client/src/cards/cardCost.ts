import {EnergyType} from "../basicGameElements";

export class CardCost {
    constructor(
        public readonly R: number = 0,
        public readonly U: number = 0,
        public readonly B: number = 0,
        public readonly Y: number = 0,
        public readonly Any: number = 0
    ) {
    }

    static fromArray(energyTypes: ReadonlyArray<EnergyType>): CardCost {
        return new CardCost(
            energyTypes.filter(x => x === EnergyType.Red).length,
            energyTypes.filter(x => x === EnergyType.Blue).length,
            energyTypes.filter(x => x === EnergyType.Black).length,
            energyTypes.filter(x => x === EnergyType.Yellow).length,
            energyTypes.length,
        );
    }
}
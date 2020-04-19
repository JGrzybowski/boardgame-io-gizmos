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

    isPaid(): boolean{
        return this.R === 0
            && this.U === 0
            && this.B === 0
            && this.Y === 0
            && this.Any === 0;
    }

    amountToPayWithEnergyType(energyType: EnergyType): number{
        switch (energyType) {
            case EnergyType.Red: return this.R;
            case EnergyType.Blue: return this.U;
            case EnergyType.Black: return this.B;
            case EnergyType.Yellow: return this.Y;
            case EnergyType.Any: return this.Any;
        }
    }

    withAmountToPayWithEnergyTypeSetTo(energyType: EnergyType, amount: number): CardCost{
        switch (energyType) {
            case EnergyType.Red: return {...this, R: amount};
            case EnergyType.Blue: return {...this, U: amount};
            case EnergyType.Black: return {...this, B: amount};
            case EnergyType.Yellow: return {...this, Y: amount};
            case EnergyType.Any: return {...this, Any: amount};
        }
    }

    add(anotherCost: CardCost): CardCost{
        return new CardCost(
            this.R + anotherCost.R,
            this.U + anotherCost.U,
            this.B + anotherCost.B,
            this.Y + anotherCost.Y,
            this.Any + anotherCost.Any
            )
    }

    subtract(anotherCost: CardCost): CardCost{
        return new CardCost(
            this.R - anotherCost.R,
            this.U - anotherCost.U,
            this.B - anotherCost.B,
            this.Y - anotherCost.Y,
            this.Any - anotherCost.Any
        )
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

    static fromTypeAndAmount(energyType: EnergyType, amount: number): CardCost{
        return new CardCost(
            energyType === EnergyType.Red ? amount : 0,
            energyType === EnergyType.Blue ? amount : 0,
            energyType === EnergyType.Black ? amount : 0,
            energyType === EnergyType.Yellow ? amount : 0,
            energyType === EnergyType.Any  ? amount : 0
        );
    }

    static canPayFor(payment: EnergyType, price: EnergyType): boolean{
        if (payment === EnergyType.Any || price === EnergyType.Any) return true;
        return payment === price;
    }
}
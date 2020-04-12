interface GameStages {
    readonly name: string;
}

export const activationsStage: GameStages = {
    name: "Activation"
};

export const paymentStage: GameStages = {
    name: "Payment"
};

export const researchStage: GameStages = {
    name: "Research"
};
import {StageConfig} from "boardgame.io";
import {archiveAction, archiveFromResearchedAction} from "../moves/archive";
import {buildFromArchiveAction, buildFromCommonAction, buildFromResearchedAction} from "../moves/build";
import {pickAction} from "../moves/pick";
import {researchAction} from "../moves/research";
import {failResearchAction} from "../moves/failResearch";

interface GameStages extends StageConfig{
    readonly name: string;
}

export const actionStage: GameStages = {
    name: "Activation",
    moves: {
        archiveAction,
        buildFromCommonAction,
        buildFromArchiveAction,
        pickAction,
        researchAction
    }
};

export const activationStage: GameStages = {
    name: "Activation"
};

export const paymentStage: GameStages = {
    name: "Payment"
};

export const researchStage: GameStages = {
    name: "Research",
    moves: {
        archiveFromResearchedAction,
        buildFromResearchedAction,
        failResearchAction
    }
};
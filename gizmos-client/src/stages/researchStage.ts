import { archiveFromResearchedAction } from "../moves/archive";
import { buildFromResearchedAction } from "../moves/build";
import { failResearchAction } from "../moves/failResearch";
import { GameStage } from "./gameStage";

export const researchStage: GameStage = {
  name: "Research",
  moves: {
    archiveFromResearchedAction,
    buildFromResearchedAction,
    failResearchAction,
  },
};

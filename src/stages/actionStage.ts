import { GameStage } from "./gameStage";
import { archiveAction } from "../moves/archive";
import { buildFromCommonAction, buildFromArchiveAction } from "../moves/build";
import { pickAction } from "../moves/pick";
import { researchAction } from "../moves/research";

export const actionStage: GameStage = {
  name: "Action",
  moves: {
    archiveAction,
    buildFromCommonAction,
    buildFromArchiveAction,
    pickAction,
    researchAction,
  },
};

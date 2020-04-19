import { confirmBuildAction } from "../moves/confirmBuild";
import { payAction } from "../moves/pay";
import { cancelBuildAction } from "../moves/cancelBuild";
import { GameStage } from "./gameStage";

export const paymentStage: GameStage = {
  name: "Payment",
  moves: {
    confirmBuildAction,
    payAction,
    cancelBuildAction,
  },
};

import { Ctx } from "boardgame.io";
import { PlayerState } from "./playerState";
import { PlayerPlugin } from "boardgame.io/dist/types/src/plugins/plugin-player";
import { RandomAPI } from "boardgame.io/dist/types/src/plugins/plugin-random";

export interface GameContext extends Ctx, PlayerPlugin<PlayerState>, RandomAPI {}

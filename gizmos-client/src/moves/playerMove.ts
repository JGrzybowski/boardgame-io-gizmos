import {Ctx, LongFormMove} from "boardgame.io";

export declare type MoveCondition<A extends any[] = any[]> = (G: any, ctx: Ctx, ...args: A) => boolean;

export interface PlayerMove extends LongFormMove{
    // condition: boolean | MoveCondition;
}
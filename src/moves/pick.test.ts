import { GameState } from "../gameState";
import { INVALID_MOVE } from "boardgame.io/core";
import { PlayerState } from "../playerState";
import { PlayerMove } from "./playerMove";
import { activationStage } from "../stages/activationStage";
import { GameContext } from "../gameContext";

test.todo("Adds energy to player's storage");
test.todo("Removes energy of given index from the EnergyRow");
test.todo("Adds new energy at the end of EnergyRow");

test.todo("can be undone");
test.todo("Returns invalid move if index is out of range");
test.todo("Returns invalid move if player has no space in the energy storage");
test.todo("Moves to activation stage");
